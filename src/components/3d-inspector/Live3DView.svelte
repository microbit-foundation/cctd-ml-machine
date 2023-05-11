<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import * as THREE from "three";
  import Smoother from "../../script/utils/Smoother";
  import Utility, { type Vector3 } from "./Live3DUtility";

  /**
   * EXPORTS
   */
  export let smoothing = false;
  export let width: number;
  export let height: number;
  export let currentDataPoint = { x: 0, y: 0, z: 0 };

  /**
   * VARIABLES DEFINED IN FUNCTIONS OR FROM ELEMENTS
   */
  let microbitModel: THREE.Scene;
  let canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderer;
  let updater: NodeJS.Timer | undefined;

  /**
   * ASSIGNED VARIABLES
   */
  const utility = new Utility();
  let scene = new THREE.Scene();
  const xSmoother = new Smoother(smoothing ? 0.65 : 0.001);
  const ySmoother = new Smoother(smoothing ? 0.65 : 0.001);
  const zSmoother = new Smoother(smoothing ? 0.65 : 0.001);
  let lastDataPoint: Vector3 = { x: 0, y: 0, z: 0 };
  let cameraTargetDistance = -100;
  let cameraCurrentDistance = -100;
  let lastIncrease = 0;

  let camera: THREE.PerspectiveCamera = utility.instantiateCameraSetup(
    width,
    height
  );

  /**
   * Add elements in 3D environment
   */
  utility.setupLightingIn(scene);
  let { barX, barY, barZ } = utility.setupBarsIn(scene);
  utility.loadMicrobitModel().then(onMicrobitModelLoad).catch(console.log);

  /**
   * Setup reactive functionality
   */
  $: handleNewDataPoint(currentDataPoint);
  $: updateCanvasSize(height, width);

  function onMicrobitModelLoad(model: THREE.Scene) {
    scene.add(model);
    microbitModel = model;
    microbitModel.lookAt(new THREE.Vector3(0, 0, -1));
    microbitModel.position.add(new THREE.Vector3(-5, -5, -5));
    updateFrame();
  }

  function handleNewDataPoint(data: Vector3) {
    if (data?.x === undefined || data?.y === undefined || data?.z === undefined)
      return;
    lastDataPoint = data;
    updateCameraTarget(data);
  }

  function updateCameraTarget(data: Vector3) {
    let setCurrentDistance =
      cameraTargetDistance === -100 || cameraCurrentDistance === -100;

    // Following two map the actual length of the latest data point to distance for the camera.
    // X and Y need different mappings than Z, as Z points up/downwards and therefore require different
    // mapping.
    const mapToCameraDistance = (val: number): number => {
      if (val < 0) return val * -1.5;
      return val * 0.6;
    };

    const mapToCameraDistanceZ = (val: number): number => {
      if (val < 0) return val * -1;
      return val * 1.4;
    };

    // Which ever number is largest, decides the distance of the camera.
    // This ensures that bars are always visible for the user
    cameraTargetDistance = Math.max(
      mapToCameraDistance(data.x),
      mapToCameraDistance(data.y),
      mapToCameraDistanceZ(data.z)
    );
    if (setCurrentDistance) cameraCurrentDistance = cameraTargetDistance;
  }

  /**
   * Updates sizes of bars given a newSizes vector
   * @param newSizes Vector3 of the latest input
   */
  function updateBarSizes(newSizes: Vector3) {
    const lengthX = newSizes.x * 3;
    barX.position.set(-5 - lengthX, -5, -5);
    barX.scale.y = Math.abs(lengthX);

    const lengthY = newSizes.y * 3;
    barY.position.set(-5, -5, -5 - lengthY);
    barY.scale.y = Math.abs(lengthY);

    const lengthZ = newSizes.z * 3;
    barZ.position.set(-5, -5 + lengthZ, -5);
    barZ.scale.y = Math.abs(lengthZ);
  }

  // When called. Update bars are updated with the latest information.
  // Camera distance and position is updated and lastly three.JS renders a new frame
  function updateFrame() {
    if (microbitModel === undefined) return;
    if (canvas === undefined) return;

    updateBarSizes({
      x: xSmoother.process(lastDataPoint.x),
      y: ySmoother.process(lastDataPoint.y),
      z: zSmoother.process(lastDataPoint.z),
    });

    updateCameraDistanceVariable();
    updateCameraPosition(cameraCurrentDistance / 2.2);
    renderer.render(scene, camera);
  }

  /**
   * Instead of moving directly to new position.
   * The cameras positions slides towards the new position.
   * This is done using a target value, and then the actual value
   * Which moves towards the target
   */
  function updateCameraDistanceVariable(): void {
    const diff = Math.max(
      -0.07,
      (cameraTargetDistance - cameraCurrentDistance) / 6
    );

    if (diff < 0) lastIncrease++;
    else {
      cameraCurrentDistance += diff;
      lastIncrease = 0;
    }

    if (25 < lastIncrease) cameraCurrentDistance += diff;
  }

  /**
   * Update camera position with new distance value
   * @param distance
   */
  function updateCameraPosition(distance: number): void {
    distance = distance * 1.6 - 0.6;
    if (distance < 0.2) distance = 0.2;
    camera.position.z = -2 + 7 * distance;
    camera.position.x = -2 + 7 * distance;
    camera.position.y = -4 + 5 * distance;
  }

  onDestroy(() => {
    if (updater !== undefined) clearInterval(updater);
  });

  onMount(() => {
    updater = setInterval(updateFrame, 25);
    renderer = utility.instantiateRenderer(canvas, width, height);
  });

  function updateCanvasSize(height: number, width: number) {
    if (camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    if (renderer) {
      renderer.setSize(width, height);
      renderer.render(scene, camera);
    }
  }
</script>

<canvas class="scene" id="3dmodel" bind:this={canvas} {width} {height} />

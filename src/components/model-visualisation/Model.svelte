<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";
  import { state } from "../../script/stores/uiStore";
  import InputNodes from "./components/InputNodes.svelte";
  import OutputNode from "./components/OutputNodes.svelte";
  import "./utility/animations.css";
  import CenterNode from "./components/CenterNode.svelte";
  import Labels from "./components/Labels.svelte";
  import {
    getIllustratedModelFrom,
    getEmptyIllustratedModel,
    type IllustratedModel,
  } from "./utility/modelVisualisation";
  import { getWeights } from "../../script/ml";
  import { modelInformation } from "./utility/modelInformation";
  import OffsetContainer from "./components/OffsetContainer.svelte";
  import { AnimationLoop } from "./utility/animationLoop";

  let illustratedModel: IllustratedModel = getEmptyIllustratedModel();
  const animationLoop = new AnimationLoop(2000);

  $: onStateUpdate($state);

  function onStateUpdate(state: any) {
    console.log("model animation state update");
    console.log(state, state.isTraining, !state.isInputConnected, !state.isPredicting)
    if (state.isTraining || !state.isInputConnected|| !state.isPredicting) return;

    updateIllustrationValues();
  }

  async function updateIllustrationValues() {
    const modelLayers = await getWeights();

    illustratedModel = getIllustratedModelFrom(
      modelLayers,
      get(modelInformation)
    );
  }

  // Update animation state to sync different components. Each may use CSS and/or JS animations
  $: animationLoop.setState($state.isPredicting);

  onDestroy(() => {
    animationLoop.setState(false);
  });
</script>

<!-- Canvas -->
<div class="duration-500 w-full h-full justify-center items-center flex">
  <!-- Loading animation -->
  <div class:animate-longbubble={$state.isTraining} class="w-150 h-100">
    <OffsetContainer offset={illustratedModel.modelOffset}>
      <!-- Elements making out model drawing -->
      <InputNodes model={illustratedModel} {animationLoop} />
      <OutputNode model={illustratedModel} {animationLoop} />
      <CenterNode
        model={illustratedModel.model}
        {animationLoop}
        isTraining={$state.isTraining}
      />
      <Labels offset={illustratedModel.modelOffset} />
    </OffsetContainer>
  </div>
</div>

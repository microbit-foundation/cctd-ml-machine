<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import KNNModelGraphController from './KNNModelGraphController';
  import * as d3 from 'd3';
  import { classifier, gestures } from '../../../script/stores/Stores';
  import ClassifierFactory from '../../../script/domain/ClassifierFactory';
  import KnnModelGraphSvgWithControls from './KnnModelGraphSvgWithControls.svelte';
  import { extractAxisFromTrainingData } from '../../../script/utils/graphUtils';
  import Axes from '../../../script/domain/Axes';
  import { TrainingData } from '../../../script/domain/ModelTrainer';
  import AxesFilterVector from './AxesFilterVector.svelte';
  import { highlightedAxis } from '../../../script/stores/uiStore';
  import PerformanceProfileTimer from '../../../script/utils/PerformanceProfileTimer';
  import { classColors, classColorShades } from './KNNModelGraphDrawer';

  let controllerSingleX: KNNModelGraphController | undefined;
  let controllerSingleY: KNNModelGraphController | undefined;
  let controllerSingleZ: KNNModelGraphController | undefined;

  const classifierFactory = new ClassifierFactory();

  // Cache training data to avoid fetching them again and again
  PerformanceProfileTimer.start('cache data');
  const allData = classifierFactory.buildTrainingData(
    gestures.getGestures(),
    classifier.getFilters(),
  );
  const xData = extractAxisFromTrainingData(allData, 0, 3);
  const yData = extractAxisFromTrainingData(allData, 1, 3);
  const zData = extractAxisFromTrainingData(allData, 2, 3);
  PerformanceProfileTimer.stop('cache data');

  const dataGetter = (axis: Axes): TrainingData => {
    if (axis === Axes.X) {
      return xData;
    }
    if (axis === Axes.Y) {
      return yData;
    }
    if (axis === Axes.Z) {
      return zData;
    }
    throw new Error('Should not happen');
  };

  const initSingle = (axis: Axes, label: string) => {
    const svgSingle = d3.selectAll('.d3-3d-single-' + label);
    const controller = new KNNModelGraphController(
      svgSingle,
      () => dataGetter(axis),
      { x: 650 / 2, y: 350 / 2 },
      'd3-3d-single-' + label,
      axis,
    );
    return controller;
  };

  onMount(() => {
    controllerSingleX = initSingle(Axes.X, 'x');
    controllerSingleY = initSingle(Axes.Y, 'y');
    controllerSingleZ = initSingle(Axes.Z, 'z');
  });
</script>

<div class="flex flex-row" class:hidden={!$classifier.model.isTrained}>
  <div class="flex flex-col justify-center mr-6">
    <AxesFilterVector />
  </div>
  <div>
    <KnnModelGraphSvgWithControls
      hidden={$highlightedAxis !== Axes.X}
      height={350}
      width={650}
      classID={'d3-3d-single-x'}
      controller={controllerSingleX} />

    <KnnModelGraphSvgWithControls
      hidden={$highlightedAxis !== Axes.Y}
      height={350}
      width={650}
      classID={'d3-3d-single-y'}
      controller={controllerSingleY} />

    <KnnModelGraphSvgWithControls
      hidden={$highlightedAxis !== Axes.Z}
      height={350}
      width={650}
      classID={'d3-3d-single-z'}
      controller={controllerSingleZ} />
  </div>
  <div class="flex flex-col ml-2 justify-center">
    {#each $gestures as gesture, index}
      <div class="flex flex-row justify-start">
        <div class="flex flex-row justify-center">
          <div class="flex flex-col justify-center mr-1">
            <div
              class="rounded-full w-3 h-3"
              style={'background-color:' + classColorShades[classColors[index]][0]} />
          </div>
          <p>{gesture.name}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

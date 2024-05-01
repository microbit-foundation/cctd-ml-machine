<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import KNNModelGraphController from './KNNModelGraphController';
  import * as d3 from 'd3';
  import { classifier, gestures, confidences } from '../../../script/stores/Stores';
  import ClassifierFactory from '../../../script/domain/ClassifierFactory';
  import KnnModelGraphSvgWithControls from './KnnModelGraphSvgWithControls.svelte';
  import { extractAxisFromTrainingData } from '../../../script/utils/graphUtils';
  import Axes from '../../../script/domain/Axes';
  import { TrainingData } from '../../../script/domain/ModelTrainer';
  import { highlightedAxis, state } from '../../../script/stores/uiStore';
  import StaticConfiguration from '../../../StaticConfiguration';
  import KnnPointToolTipView from './KnnPointToolTipView.svelte';
  import AxesFilterVectorView from './AxesFilterVectorView.svelte';
  import { get } from 'svelte/store';

  let controller: KNNModelGraphController | undefined;

  const classifierFactory = new ClassifierFactory();

  // Cache training data to avoid fetching them again and again
  const allData = classifierFactory.buildTrainingData(
    gestures.getGestures(),
    classifier.getFilters(),
  );

  const accelXData = extractAxisFromTrainingData(allData, 0, 3);
  const accelYData = extractAxisFromTrainingData(allData, 1, 3);
  const accelZData = extractAxisFromTrainingData(allData, 2, 3);

  const dataGetter = (axis: Axes): TrainingData => {
    if (axis === Axes.X) {
      return accelXData;
    }
    if (axis === Axes.Y) {
      return accelYData;
    }
    if (axis === Axes.Z) {
      return accelZData;
    }
    throw new Error('Should not happen');
  };

  const initSingle = (axis: Axes) => {
    const svgSingle = d3.select('.d3-3d-single');
    const controller = new KNNModelGraphController(
      svgSingle,
      () => dataGetter(axis),
      { x: 650 / 2, y: 350 / 2 },
      'd3-3d-single-',
      axis,
    );
    return controller;
  };

  $: {
    if ($highlightedAxis) {
      if (controller) {
        controller.destroy();
      }
      controller = initSingle($highlightedAxis);
    }
  }

  onMount(() => {
    controller = initSingle(Axes.X);
    return () => {
      controller?.destroy();
    };
  });
</script>

<div class="flex flex-row" class:hidden={!$classifier.model.isTrained}>
  <div class="flex flex-col justify-center mr-6">
    <AxesFilterVectorView />
    <div class="flex flex-col ml-2 justify-center mt-2">
      {#each $gestures as gesture, index}
        <div class="flex flex-row justify-between">
          <div class="flex flex-row">
            <div class="flex flex-col justify-center mr-1">
              <div
                class="rounded-full w-3 h-3"
                style={'background-color:' + StaticConfiguration.gestureColors[index]} />
            </div>
            <p>{gesture.name}</p>
          </div>
          {#if $state.isInputReady}
            <p>{($confidences.get(gesture.ID).currentConfidence * 100).toFixed(2)}%</p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <div class="relative">
    <KnnModelGraphSvgWithControls
      hidden={false}
      height={350}
      width={650}
      classID={'d3-3d-single'}
      {controller} />

    <KnnPointToolTipView />
  </div>
</div>

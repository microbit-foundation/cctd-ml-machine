<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import ClassifierFactory from '../../script/domain/ClassifierFactory';
  import { stores } from '../../script/stores/Stores';
  import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
  import { TrainingData } from '../../script/domain/ModelTrainer';
  import {
    highlightedAxis,
    prevHighlightedAxis,
    selectedModel,
    state,
  } from '../../script/stores/uiStore';
  import Axes from '../../script/domain/Axes';
  import * as d3 from 'd3';
  import KNNModelGraphController, {
    controller,
  } from '../../components/graphs/knngraph/KNNModelGraphController';
  import AxesFilterVectorView from '../../components/graphs/knngraph/AxesFilterVectorView.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import KnnModelGraphSvgWithControls from '../../components/graphs/knngraph/KnnModelGraphSvgWithControls.svelte';
  import KnnPointToolTipView from '../../components/graphs/knngraph/KnnPointToolTipView.svelte';
  import { trainModel } from './TrainingPage';
  import ModelRegistry from '../../script/domain/ModelRegistry';

  const classifierFactory = new ClassifierFactory();

  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();
  const confidences = gestures.getConfidences();

  const canvasWidth = 550;
  const canvasHeight = 350;

  // Cache training data to avoid fetching them again and again
  const allData = classifierFactory.buildTrainingData(
    gestures.getGestures(),
    classifier.getFilters(),
  );

  const accelXData = extractAxisFromTrainingData(allData, 0, 3);
  const accelYData = extractAxisFromTrainingData(allData, 1, 3);
  const accelZData = extractAxisFromTrainingData(allData, 2, 3);

  const dataGetter = (): TrainingData => {
    const axis = get(highlightedAxis);
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
      () => dataGetter(),
      { x: canvasWidth / 2, y: canvasHeight / 2 },
      'd3-3d-single-',
      axis,
    );
    return controller;
  };

  $: {
    if ($highlightedAxis) {
      if (get(controller)) {
        get(controller)!.destroy();
      }
      controller.set(initSingle($highlightedAxis));
    } else {
      $highlightedAxis = Axes.X;
    }
  }

  onMount(() => {
    controller.set(initSingle(Axes.X));
    return () => {
      get(controller)?.destroy();
    };
  });
  // Should be in KNNModelGraph instead
  onMount(() => {
    const unsubscribe = highlightedAxis.subscribe(axis => {
      if ($selectedModel.id === 'KNN') {
        if (!axis) {
          return;
        }
        if ($prevHighlightedAxis === axis) {
          return;
        }
        trainModel(ModelRegistry.KNN);
        prevHighlightedAxis.set(axis);
      }
    });
    return unsubscribe;
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
            <p>
              {(($confidences.get(gesture.ID)?.currentConfidence ?? 0) * 100).toFixed(2)}%
            </p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <div class="relative">
    <KnnModelGraphSvgWithControls
      hidden={false}
      height={canvasHeight}
      width={canvasWidth}
      classID={'d3-3d-single'}
      controller={$controller} />
    <KnnPointToolTipView />
  </div>
</div>

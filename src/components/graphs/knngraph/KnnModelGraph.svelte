<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import KNNModelGraphController, { controller } from './KNNModelGraphController';
  import * as d3 from 'd3';
  import ClassifierFactory from '../../../script/domain/ClassifierFactory';
  import KnnModelGraphSvgWithControls from './KnnModelGraphSvgWithControls.svelte';
  import { extractAxisFromTrainingData } from '../../../script/utils/graphUtils';
  import Axes from '../../../script/domain/Axes';
  import { TrainingData } from '../../../script/domain/ModelTrainer';
  import { highlightedAxis } from '../../../script/stores/uiStore';
  import KnnPointToolTipView from './KnnPointToolTipView.svelte';
  import { stores } from '../../../script/stores/Stores';
  import { get } from 'svelte/store';

  const classifierFactory = new ClassifierFactory();

  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();

  const canvasWidth = 450;
  const canvasHeight = 300;

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
    }
  }

  onMount(() => {
    controller.set(initSingle(Axes.X));
    return () => {
      get(controller)?.destroy();
    };
  });
</script>

<div class="relative">
  <KnnModelGraphSvgWithControls
    hidden={false}
    height={canvasHeight}
    width={canvasWidth}
    classID={'d3-3d-single'}
    controller={$controller} />
  <KnnPointToolTipView />
</div>

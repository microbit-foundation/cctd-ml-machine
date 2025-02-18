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
  import { type TrainingData } from '../../../script/domain/ModelTrainer';
  import KnnPointToolTipView from './KnnPointToolTipView.svelte';
  import { stores } from '../../../script/stores/Stores';
  import { get } from 'svelte/store';
  import StaticConfiguration from '../../../StaticConfiguration';
  import { FilterType } from '../../../script/domain/FilterTypes';

  const classifierFactory = new ClassifierFactory();

  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();
  const filters = classifier.getFilters();
  const highlightedAxes = stores.getHighlightedAxes();
  const modelSettings = stores.getKNNModelSettings()

  const canvasWidth = 450;
  const canvasHeight = 300;

  if ($highlightedAxes.length !== 1) {
    throw new Error('KNN model graph only supports a single highlighted axis');
  }

  // Cache training data to avoid fetching them again and again
  const allData = classifierFactory.buildTrainingData(
    gestures.getGestures(),
    classifier.getFilters(),
  );

  const accelXData = extractAxisFromTrainingData(allData, 0, 3);
  const accelYData = extractAxisFromTrainingData(allData, 1, 3);
  const accelZData = extractAxisFromTrainingData(allData, 2, 3);

  const dataGetter = (): TrainingData => {
    const axis = $highlightedAxes[0];
    if (axis.index === 0) {
      return accelXData;
    }
    if (axis.index === 1) {
      return accelYData;
    }
    if (axis.index === 2) {
      return accelZData;
    }
    throw new Error('Cannot get data for axis ' + axis);
  };

  const initSingle = (axis: number) => {
    const svgSingle = d3.select('.d3-3d-single');
    const graphColors = [
      ...$gestures.map(data => data.color),
      StaticConfiguration.gestureColors[$gestures.length],
    ];
    if (graphColors.length <= $gestures.length) {
      throw new Error('Not enough colors');
    }
    const controller = new KNNModelGraphController(
      svgSingle,
      () => dataGetter(),
      { x: canvasWidth / 2, y: canvasHeight / 2 },
      'd3-3d-single-',
      graphColors,
      modelSettings,
      axis,
    );
    return controller;
  };

  $: {
    if (get(controller)) {
      get(controller)!.destroy();
      controller.set(initSingle($highlightedAxes[0].index));
    }
  }

  filters.subscribe(() => {
    const expandedZoom = filters.has(FilterType.ACC) || filters.has(FilterType.PEAKS);
    get(controller)?.multiplyScale(expandedZoom ? 1.5 : 1);
  });

  onMount(() => {
    if ($highlightedAxes.length === 1) {
      controller.set(initSingle(0));
    }
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

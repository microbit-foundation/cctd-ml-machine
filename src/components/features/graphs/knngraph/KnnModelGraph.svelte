<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import KNNModelGraphController, { controller } from './KNNModelGraphController';
  import * as d3 from 'd3';
  import KnnModelGraphSvgWithControls from './KnnModelGraphSvgWithControls.svelte';
  import KnnPointToolTipView from './KnnPointToolTipView.svelte';
  import { get } from 'svelte/store';
  import { stores } from '../../../../lib/stores/Stores';
  import StaticConfiguration from '../../../../StaticConfiguration';
  import { FilterType } from '../../../../lib/domain/FilterTypes';

  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();
  const filters = classifier.getFilters();
  const highlightedAxes = stores.getHighlightedAxes();

  const canvasWidth = 450;
  const canvasHeight = 300;

  if ($highlightedAxes.length !== 1) {
    throw new Error('KNN model graph only supports a single highlighted axis');
  }

  const initSingle = () => {
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
      { x: canvasWidth / 2, y: canvasHeight / 2 },
      'd3-3d-single-',
      graphColors,
    );
    return controller;
  };

  $: {
    if (get(controller)) {
      get(controller)!.destroy();
      controller.set(initSingle());
    }
  }

  filters.subscribe(() => {
    const expandedZoom = filters.has(FilterType.ACC) || filters.has(FilterType.PEAKS);
    get(controller)?.multiplyScale(expandedZoom ? 1.5 : 1);
  });

  onMount(() => {
    if ($highlightedAxes.length === 1) {
      controller.set(initSingle());
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

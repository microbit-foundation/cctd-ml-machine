<!--
  (c) 2024, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import * as tfvis from '@tensorflow/tfjs-vis';
  import { onMount } from 'svelte';
  import { RecordingData } from '../../script/domain/stores/gesture/Gestures';
  import AccelerometerClassifierInput from '../../script/mlmodels/AccelerometerClassifierInput';
  import { classifier } from '../../script/stores/Stores';

  export let recording: RecordingData;
  export let gestureName: string;

  let surface: undefined | tfvis.Drawable;

  const filtersLabels: string[] = [];
  const filters = classifier.getFilters();
  $filters.forEach(filter => {
    const filterName = filter.getName();
    filtersLabels.push(`${filterName} - x`, `${filterName} - y`, `${filterName} - z`);
  });

  const getFilteredInput = (): number[][] => {
    const { x, y, z } = recording.data;
    const input = new AccelerometerClassifierInput(x, y, z);
    return [input.getNormalizedInput(filters)];
  };

  const chartData = {
    values: getFilteredInput(),
    xTickLabels: [gestureName],
    yTickLabels: filtersLabels,
  };

  onMount(() => {
    if (surface) {
      tfvis.render.heatmap(surface, chartData, {
        colorMap: 'viridis',
        height: 100,
        width: 80,
        domain: [0, 1],
        fontSize: 0,
      });
    }
  });
</script>

<div class="relative w-30px h-93px overflow-hidden rounded-sm -mt-1 mr-3">
  <div class="absolute h-full w-full -left-10px right-0 -bottom-1px top-0">
    <div bind:this={surface}></div>
  </div>
</div>

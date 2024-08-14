<!--
  (c) 2024, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import * as tfvis from '@tensorflow/tfjs-vis';
  import { onMount } from 'svelte';
  import { classifier, engine } from '../../script/stores/Stores';

  let surface: undefined | tfvis.Drawable;

  const filtersLabels: string[] = [];
  const filters = classifier.getFilters();
  $filters.forEach(filter => {
    const filterName = filter.getName();
    filtersLabels.push(`${filterName} - x`, `${filterName} - y`, `${filterName} - z`);
  });

  const getFilteredInput = (): number[][] => {
    const input = engine.bufferToInput();
    const features = input.getNormalizedInput(filters);
    if (features.length) {
      return [input.getNormalizedInput(filters)];
    }
    return [disconnectedData];
  };

  const disconnectedData = new Array(filtersLabels.length).fill(0);

  onMount(() => {
    const interval = setInterval(() => {
      if (surface) {
        const chartData = {
          values: getFilteredInput(),
          xTickLabels: ['Live'],
          yTickLabels: filtersLabels,
        };

        tfvis.render.heatmap(surface, chartData, {
          colorMap: 'viridis',
          height: 166,
          width: 210,
          domain: [0, 1],
          fontSize: 0,
        });
      }
    });
    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="relative w-160px h-160px overflow-hidden rounded-sm">
  <div class="absolute h-full w-full -left-10px right-0 -bottom-1px top-0">
    <div bind:this={surface}></div>
  </div>
</div>

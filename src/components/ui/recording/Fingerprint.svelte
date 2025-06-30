<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import * as tfvis from '@tensorflow/tfjs-vis';
  import { onMount } from 'svelte';
  import Logger from '../../../lib/utils/Logger';

  export let fingerprint: number[];
  export let title: string;
  export let filterLabels: string[];
  export let height: number = 100;
  export let width: number = 80;

  let surface: undefined | tfvis.Drawable;

  // Reactive chart data that updates when props change
  $: chartData = {
    values: [fingerprint],
    xTickLabels: [title],
    yTickLabels: filterLabels,
  };

  const render = async () => {
    if (!surface) {
      return;
    }
    try {
      await tfvis.render.heatmap(surface, chartData, {
        colorMap: 'viridis',
        height: height,
        width: width,
        domain: [0, 1],
        fontSize: 0,
      });
    } catch (error) {
      Logger.log('Fingerprint failed to render', error);
    }
  };

  onMount(() => {
    // Initial render
    render();
  });

  // Reactive statement to rerender when data changes
  $: if (surface && (fingerprint || filterLabels || title)) {
    render();
  }
</script>

<div bind:this={surface}></div>

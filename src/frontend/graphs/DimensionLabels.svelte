<style>
  .arrowLeft {
    border-width: 10px;
    border-color: rgba(255, 255, 255, 0);
  }
</style>

<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type SmoothedLiveData from '../lib/livedata/SmoothedLiveData';
  import type { LiveDataVector } from '../../core/vector/LiveDataVector';
  import { DimensionLabelsController } from './DimensionLabels';

  export let liveData: SmoothedLiveData<LiveDataVector>;
  export let maxValue: number;
  export let minValue: number;
  export let graphHeight: number;
  export let hidden: boolean = false;

  const controller = new DimensionLabelsController(
    liveData,
    () => maxValue,
    () => minValue,
    () => graphHeight,
  );

  const labels = controller.labels;
  const labelEnabled = controller.labelEnabled;

  onMount(() => {
    controller.start();
  });

  onDestroy(() => {
    controller.stop();
  });
</script>

{#if !hidden}
  <div class="h-40 w-6 relative">
    {#each $labels as label, idx}
      {#if $labelEnabled[idx]}
        <div
          class="absolute arrowLeft -m-3.5"
          style="bottom: {label.arrowHeight}px; border-right-color: {label.color};" />
        <p
          class="absolute ml-3 text-xl"
          style="bottom: {label.textHeight}px; color: {label.color};">
          {label.label}
        </p>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .arrowLeft {
    border-width: 10px;
    border-color: rgba(255, 255, 255, 0);
  }
</style>

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { state } from '../../script/stores/uiStore';
  import StaticConfiguration from '../../StaticConfiguration';
    import SmoothedLiveData from '../../script/livedata/SmoothedLiveData';

    type labelData = {
      id: number,
      label: string,
      color: string,
      arrowHeight: number,
      labelHeight: number
    }
  export let liveData: SmoothedLiveData<any>;

  let unsubscribeFromLiveData: Unsubscriber | undefined = undefined;

  onMount(() => {
    unsubscribeFromLiveData = liveData.subscribe(data => {
      const dataInArray = [];
      for (const property in data) {
        dataInArray.push(data[property]);
      }
      updateDimensionLabels(dataInArray);
    });
  });

  onDestroy(() => {
    unsubscribeFromLiveData?.();
  });

  // Initialize labels with all-0 values
  const initializeLabels = (): labelData[] => {
    const labels = []
    for (let i = 0; i < liveData.getSeriesSize(); i++) {
      const label = liveData.getLabels()[i];
      const color = StaticConfiguration.liveGraphColors[i];
      labels.push({
        label: label,
        color: color,
        arrowHeight:0,
        labelHeight:0,
        id:i
      })
    }
    return labels;
  }

  let labels: labelData[] = initializeLabels();

  function updateDimensionLabels(axes: number[]) {
    for (let i = 0; i < axes.length; i++) {
      const newValue = (2.1 - axes[labels[i].id]) * 2.32;
      labels[i].arrowHeight = newValue
      labels[i].labelHeight = newValue; // will be overridden in fixOverlappingLabels if necessary
    }
    fixOverlappingLabels();
  }

  function fixOverlappingLabels() {
    labels.sort((a, b) => {
      return a.arrowHeight - b.arrowHeight;
    });
    const MIN_DISTANCE = 1.1;
    for (let i = 1; i < labels.length; i++) {
      const element = labels[i];
      const previousLabel = labels[i-1];
      if (element.labelHeight < previousLabel.labelHeight + MIN_DISTANCE) {
        // Label is overlapping, push it down
        element.labelHeight = previousLabel.labelHeight + MIN_DISTANCE;
      }
    }
  }
</script>

{#if $state.isInputConnected}
  <div class="h-40 w-6 relative">
    {#each labels as dimension}
      <div
        class="absolute arrowLeft -m-3.5"
        style="transform: translateY({dimension.arrowHeight +
          0.75}rem) scale(1, 0.75); border-right-color: {dimension.color};" />
      <p
        class="absolute ml-3 text-xl"
        style="transform: translateY({dimension.labelHeight -
          0.5}rem); color: {dimension.color};">
        {dimension.label}
      </p>
    {/each}
  </div>
{/if}

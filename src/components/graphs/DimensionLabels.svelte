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

  type LabelData = {
    id: number;
    label: string;
    color: string;
    arrowHeight: number;
    textHeight: number;
  };
  // The height of character is used to fix overlapping line labels
  const CHARACTER_HEIGHT = 16;

  export let liveData: SmoothedLiveData<any>;
  export let maxValue: number;
  export let minValue: number;
  export let graphHeight: number;
  export let hidden: boolean = false;

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
  const initializeLabels = (): LabelData[] => {
    const labels = [];
    for (let i = 0; i < liveData.getSeriesSize(); i++) {
      const label = liveData.getLabels()[i];
      const color = StaticConfiguration.liveGraphColors[i];
      labels.push({
        label: label,
        color: color,
        arrowHeight: 0,
        textHeight: 0,
        id: i,
      });
    }
    return labels;
  };

  let labels: LabelData[] = initializeLabels();

  function updateDimensionLabels(axes: number[]) {
    for (let i = 0; i < axes.length; i++) {
      const normalMax = maxValue - minValue;
      const normalValue = axes[labels[i].id] - minValue;
      const newValue = (normalValue / normalMax) * graphHeight;
      if (labels[i].label === 'Z') {
      }
      labels[i].arrowHeight = newValue + 4; // We add 4 to align the arrow to the graph line
      // labelHeight will be overridden in fixOverlappingLabels if necessary
      labels[i].textHeight = newValue - CHARACTER_HEIGHT + 2; // Subract height to align with arrow
    }
    fixOverlappingLabels();
  }

  function fixOverlappingLabels() {
    labels.sort((a, b) => {
      return a.arrowHeight - b.arrowHeight;
    });
    for (let i = 1; i < labels.length; i++) {
      const element = labels[i];
      const previousLabel = labels[i - 1];
      if (element.textHeight < previousLabel.textHeight + CHARACTER_HEIGHT) {
        // Label is overlapping, push it down.
        element.textHeight = previousLabel.textHeight + CHARACTER_HEIGHT;
      }
    }
  }
</script>

{#if !hidden}
  <div class="h-40 w-6 relative">
    {#each labels as label}
      <div
        class="absolute arrowLeft -m-3.5"
        style="bottom: {label.arrowHeight}px; border-right-color: {label.color};" />
      <p
        class="absolute ml-3 text-xl"
        style="bottom: {label.textHeight}px; color: {label.color};">
        {label.label}
      </p>
    {/each}
  </div>
{/if}

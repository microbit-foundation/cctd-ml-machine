<style>
  /* small local styles if needed */
</style>

<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import RecordingGraph from '../../features/graphs/recording/RecordingGraph.svelte';
  import RecordingFingerprint from './RecordingFingerprint.svelte';
  import { serializeRecordingToCsvWithoutGestureName } from '../../../lib/utils/CSVUtils';
  import type { RecordingData } from '../../../lib/domain/RecordingData';
  import { Feature, hasFeature } from '../../../lib/FeatureToggles';
  import { tr } from '../../../i18n';

  export let recording: RecordingData;
  export let gestureName: string = '';
  export let downloadable: boolean = false;
  export let enableFingerprint: boolean = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function confirmDelete() {
    dispatch('delete');
  }

  function downloadCsv() {
    const csvContent = serializeRecordingToCsvWithoutGestureName(recording);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${gestureName}_recording_${recording.ID}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  $: shouldDisplayFingerprint = enableFingerprint && hasFeature(Feature.FINGERPRINT);

  // Compute y-axis bounds from recording samples (rounded down/up to nearest integer)
  let computedYAxisMin: number;
  let computedYAxisMax: number;

  $: {
    const defaultMin = -5.5;
    const defaultMax = 6.5;
    const allValues: number[] = recording.samples.flatMap(s => s.vector);

    if (allValues.length > 0) {
      const minV = Math.min(...allValues);
      const maxV = Math.max(...allValues);
      computedYAxisMin = Math.floor(minV);
      computedYAxisMax = Math.ceil(maxV);
      // Ensure we have a range
      if (computedYAxisMin >= computedYAxisMax) {
        computedYAxisMin = computedYAxisMin - 1;
        computedYAxisMax = computedYAxisMax + 1;
      }
    } else {
      computedYAxisMin = Math.floor(defaultMin);
      computedYAxisMax = Math.ceil(defaultMax);
    }
  }
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center cursor-auto"
  transition:fade
  on:click={close}>
  <div class="absolute inset-0 bg-black opacity-50 cursor-default" />

  <div
    class="relative bg-white rounded-md w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl p-4 shadow-lg"
    on:click|stopPropagation
    transition:fade>
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold">{gestureName}</h3>
      <div class="flex items-center space-x-2">
        {#if downloadable}
          <button
            class="px-2 py-1 text-sm text-light-800 hover:text-black"
            on:click={downloadCsv}>
            <i class="fas fa-download mr-1" />{$tr('content.data.dialog.download') ||
              'Download CSV'}
          </button>
        {/if}
        <button
          class="px-2 py-1 text-sm text-red-600 hover:text-red-800"
          on:click={confirmDelete}>
          <i class="fas fa-trash mr-1" />{$tr('content.data.dialog.delete') || 'Delete'}
        </button>
        <button class="px-2 py-1 text-sm text-gray-600 hover:text-black" on:click={close}>
          <i class="fas fa-times" />
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 bg-gray-50 p-2 rounded">
        <div class="w-full h-80 md:h-96">
          <RecordingGraph
            {recording}
            showYAxisTicks={true}
            yAxisMin={computedYAxisMin}
            yAxisMax={computedYAxisMax} />
        </div>
      </div>

      {#if shouldDisplayFingerprint}
        <div class="w-full md:w-56 bg-gray-50 p-2 rounded overflow-hidden">
          <RecordingFingerprint {recording} {gestureName} />
        </div>
      {/if}
    </div>
  </div>
</div>

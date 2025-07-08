<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { GestureID } from '../../../lib/domain/stores/gesture/Gesture';
  import { stores } from '../../../lib/stores/Stores';
  import GestureDot from './../GestureDot.svelte';
  import RecordingGraph from '../../features/graphs/recording/RecordingGraph.svelte';
  import type { RecordingData } from '../../../lib/domain/RecordingData';
  import Tooltip from './../Tooltip.svelte';
  import { serializeRecordingToCsvWithoutGestureName } from '../../../lib/utils/CSVUtils';
  import RecordingFingerprint from './RecordingFingerprint.svelte';
  import { Feature, hasFeature } from '../../../lib/FeatureToggles';
    import { tr } from '../../../i18n';

  // get recording from mother prop
  export let recording: RecordingData;
  export let gestureId: GestureID;
  export let onDelete: (recording: RecordingData) => void;
  export let dot: { gesture: GestureID; color: string } | undefined = undefined;
  export let downloadable: boolean = false;
  export let enableFingerprint: boolean = false;

  $: dotGesture = dot?.gesture
    ? stores.getGestures().getGesture(dot?.gesture)
    : undefined;

  $: gesture = stores.getGestures().getGesture(gestureId);
  let hide = false;

  // Method for propagating deletion of recording
  function deleteClicked() {
    if (hide) {
      return;
    }

    hide = true;
    setTimeout(() => {
      hide = false;
      onDelete(recording);
    }, 450);
  }

  function bottomRightButtonClicked() {
    const csvContent = serializeRecordingToCsvWithoutGestureName(recording);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${gesture.getName()}_recording_${recording.ID}.csv`;
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }

  const shouldDisplayFingerprint = enableFingerprint && hasFeature(Feature.FINGERPRINT);
</script>

<div
  class="h-28 w-50 pr-3 pt-1 relative rounded-md"
  class:w-40={!shouldDisplayFingerprint}
  class:w-50={shouldDisplayFingerprint}>
  {#if dotGesture !== undefined}
    <div
      class="absolute px-1 py-0.5 z-3 right-1 top-2"
      class:right-1={!shouldDisplayFingerprint}
      class:right-10={shouldDisplayFingerprint}>
      <GestureDot gesture={dotGesture} />
    </div>
  {/if}
  {#if hide}
    <div
      transition:fade
      class="absolute h-26 bg-white"
      class:w-40={!shouldDisplayFingerprint}
      class:w-50={shouldDisplayFingerprint} />
  {:else}
    <div
      transition:fade
      class="absolute h-26 bg-white rounded-md"
      class:w-40={!shouldDisplayFingerprint}
      class:w-50={shouldDisplayFingerprint}>
      <div class="w-40 h-26">
        <RecordingGraph {recording} />
      </div>
      {#if shouldDisplayFingerprint}
        <div class="absolute top-0 left-40 h-24.5 w-10 overflow-hidden">
          <RecordingFingerprint {recording} gestureName={$gesture.name} />
        </div>
      {/if}
    </div>
  {/if}
    <Tooltip title={$tr("content.data.tooltip.remove")} offset={{ x: -26, y: -50 }}>
  <button class="absolute -left-2.8px top-0px outline-none">
    <div class="relative">
      <i class="z-1 absolute fas fa-circle fa-lg text-white" />
      <i
        class="z-2 absolute far fa-times-circle fa-lg transition
									ease cursor-pointer text-light-800 hover:text-black"
        on:click={deleteClicked} />
    </div>
  </button>
    </Tooltip>

  <!-- Download Button -->
  {#if downloadable}
    <Tooltip title="CSV" offset={{ x: 12, y: -50 }}>
      <button
      class="absolute top-0px left-6 text-light-800 hover:text-black transition ease"
        on:click={bottomRightButtonClicked}>
        <i class="fas fa-download z-1 absolute fa-md" />
      </button>
    </Tooltip>
  {/if}
</div>

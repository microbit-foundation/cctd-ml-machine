<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { stores } from '../../../lib/stores/Stores';
  import GestureDot from './../GestureDot.svelte';
  import RecordingGraph from '../../features/graphs/recording/RecordingGraph.svelte';
  import type { RecordingData } from '../../../core/entities/RecordingData';
  import IconButton from '../buttons/IconButton.svelte';
  import { serializeRecordingToCsvWithoutGestureName } from '../../../lib/utils/CSVUtils';
  import RecordingFingerprint from './RecordingFingerprint.svelte';
  import { Feature, hasFeature } from '../../../lib/FeatureToggles';
  import { tr } from '../../../i18n';
  import RecordingDialog from './RecordingDialog.svelte';
  import type { GestureID } from '../../../core/entities/Gesture';

  // get recording from mother prop
  export let recording: RecordingData;
  export let gestureId: GestureID;
  export let onDelete: (recording: RecordingData) => void;
  export let dot: { gesture: GestureID; color: string } | undefined = undefined;
  export let downloadable: boolean = false;
  export let enableFingerprint: boolean;

  $: dotGesture = dot?.gesture
    ? stores.getGestures().getGesture(dot?.gesture)
    : undefined;

  $: gesture = stores.getGestures().getGesture(gestureId);
  let hide = false;
  let showDialog = false;

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

  function openDialog() {
    if (!hasFeature(Feature.DIALOG_RECORDINGS)) {
      return;
    }
    showDialog = true;
  }

  function closeDialog() {
    showDialog = false;
  }

  function dialogDelete() {
    // close and propagate delete
    showDialog = false;
    deleteClicked();
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

  $: shouldDisplayFingerprint = enableFingerprint && hasFeature(Feature.FINGERPRINT);
</script>

<div
  class="h-28 w-50 pr-3 pt-1 relative rounded-md cursor-pointer"
  class:cursor-pointer={hasFeature(Feature.DIALOG_RECORDINGS)}
  class:w-40={!shouldDisplayFingerprint}
  class:w-50={shouldDisplayFingerprint}
  on:click={openDialog}>
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
  <IconButton
    className="absolute -left-2.8px top-0px outline-none"
    ariaLabel={$tr('content.data.tooltip.remove')}
    title={$tr('content.data.tooltip.remove')}
    small
    on:click={e => {
      e.stopPropagation();
      deleteClicked();
    }}>
    <div class="relative">
      <i class="z-1 absolute fas fa-circle fa-lg text-white" />
      <i
        class="z-2 absolute far fa-times-circle fa-lg transition
                                  ease text-light-800 hover:text-black"
        aria-hidden="true" />
    </div>
  </IconButton>

  <!-- Download Button -->
  {#if downloadable}
    <IconButton
      className="absolute top-7px left-8 text-light-800 hover:text-black transition ease"
      ariaLabel="CSV"
      title="CSV"
      small
      on:click={e => {
        e.stopPropagation();
        bottomRightButtonClicked();
      }}>
      <i class="fas fa-download z-1 absolute fa-md" aria-hidden="true" />
    </IconButton>
  {/if}

  {#if showDialog}
    <RecordingDialog
      {recording}
      gestureName={$gesture.name}
      {downloadable}
      {enableFingerprint}
      on:close={closeDialog}
      on:delete={dialogDelete} />
  {/if}
</div>

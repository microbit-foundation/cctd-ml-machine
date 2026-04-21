<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
    import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import MediaQuery from '../../components/layout/MediaQuery.svelte';
  import type { GestureID } from '../../core/entities/Gesture';

  export let gestureId: GestureID;
  const recordingState = getControllers().getRecordingController().getRecordingState();
  const settings = getControllers().getRecordingController().getRecordingSettings();

  $: isThisRecording = $recordingState.getRecordingGesture()?.getID() === gestureId;

  const recordingDuration = $settings.getRecordingDuration();
</script>

<!-- We use mediaquery, since the side-bar changes size based on this media query -->
<MediaQuery query="(max-width: 1500px)" let:matches={isSmall}>
  {#if isSmall}
    <div class="relative w-[calc(100vw-320px)] left-[-220px]">
      <div class="absolute w-full left-0">
        <div
          class="bg-red-600 h-1.5 rounded-full absolute mt-123px ml-14px left-0"
          style={isThisRecording
            ? `transition: ${(recordingDuration / 1000).toString()}s linear; width: 97%;`
            : 'width:0;'} />
      </div>
    </div>
  {:else}
    <div class="relative w-[calc(100vw-380px)] left-[-260px]">
      <div class="absolute w-full left-0">
        <div
          class="bg-red-600 h-1.5 rounded-full absolute mt-123px ml-14px left-0"
          style={isThisRecording
            ? `transition: ${(recordingDuration / 1000).toString()}s linear; width: 97%;`
            : 'width:0;'} />
      </div>
    </div>
  {/if}
</MediaQuery>

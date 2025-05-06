<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import MediaQuery from '../../components/MediaQuery.svelte';
  import type { GestureID } from '../../lib/domain/stores/gesture/Gesture';
  import { stores } from '../../lib/stores/Stores';
  import StaticConfiguration from '../../StaticConfiguration';

  export let gestureId: GestureID;
  const recorder = stores.getRecorder();

  $: isThisRecording = $recorder.recordingGesture === gestureId;
</script>

<!-- We use mediaquery, since the side-bar changes size based on this media query -->
<MediaQuery query="(max-width: 1500px)" let:matches={isSmall}>
  {#if isSmall}
    <div class="relative w-[calc(100vw-320px)] left-[-220px]">
      <div class="absolute w-full left-0">
        <div
          class="bg-red-600 h-1.5 rounded-full absolute mt-123px ml-14px left-0"
          style={isThisRecording
            ? `transition: ${(
                StaticConfiguration.recordingDuration / 1000
              ).toString()}s linear; width: 97%;`
            : 'width:0;'} />
      </div>
    </div>
  {:else}
    <div class="relative w-[calc(100vw-380px)] left-[-260px]">
      <div class="absolute w-full left-0">
        <div
          class="bg-red-600 h-1.5 rounded-full absolute mt-123px ml-14px left-0"
          style={isThisRecording
            ? `transition: ${(
                StaticConfiguration.recordingDuration / 1000
              ).toString()}s linear; width: 97%;`
            : 'width:0;'} />
      </div>
    </div>
  {/if}
</MediaQuery>

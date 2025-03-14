<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import GestureCard from '../../components/GestureCard.svelte';
  import Recording from '../../components/Recording.svelte';
  import type Gesture from '../../script/domain/stores/gesture/Gesture';
    import { stores } from '../../script/stores/Stores';

  export let gesture: Gesture;
  const validationSet = stores.getValidationSets().getForGesture(gesture.getId());
  $: recordings = $validationSet.recordings
</script>

<GestureCard small>
  <div class="flex flex-row h-full items-center pl-2">
    {#each recordings as recording}
      <Recording
        {recording}
        onDelete={recording => gesture.removeRecording(recording.ID)} />
    {/each}
  </div>
</GestureCard>

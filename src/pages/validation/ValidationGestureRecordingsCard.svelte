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

  const validationSets = stores.getValidationSets();
  const validationSet = stores.getValidationSets().getForGesture(gesture.getId());
  const results = stores.getValidationResults();
  const gestures = stores.getGestures()

  $: gestureIdx = $gestures.findIndex(gest => gest.ID === gesture.getId());
  $: recordings = $validationSet.recordings;
  $: predictedGestures = ($results[gestureIdx] ?? []).map(a => $gestures[a.gestureIdx]);
</script>

<GestureCard small>
  <div class="flex flex-row h-full items-center pl-2">
    {#each recordings as recording, idx}
      {#key recording.ID}
        <Recording
          dotColor={predictedGestures[idx]?.color}
          {recording}
          onDelete={recording =>
            validationSets.removeValidationRecording(recording.ID)} />
      {/key}
    {/each}
  </div>
</GestureCard>

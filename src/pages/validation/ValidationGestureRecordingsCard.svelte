<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import GestureCard from '../../components/GestureCard.svelte';
  import Recording from '../../components/Recording.svelte';
  import type { GestureID } from '../../script/domain/stores/gesture/Gesture';
  import type Gesture from '../../script/domain/stores/gesture/Gesture';
  import { stores } from '../../script/stores/Stores';

  export let gesture: Gesture;

  const validationSets = stores.getValidationSets();
  const validationSet = stores.getValidationSets().getForGesture(gesture.getId());
  const results = stores.getValidationResults();
  const gestures = stores.getGestures();

  $: gestureIdx = $gestures.findIndex(gest => gest.ID === gesture.getId());
  $: recordings = $validationSet.recordings;
  $: predictedGestures = ($results[gestureIdx] ?? []).map(a => $gestures[a.gestureIdx]);
  $: dots = $results.map((_, idx) => {
    const prediction = predictedGestures[idx];
    if (!prediction) {
      return undefined;
    }
    return {
      color: predictedGestures[idx]?.color,
      gesture: predictedGestures[idx].ID,
    };
  });
</script>

<GestureCard validationPage={true} small>
  <div class="flex flex-row h-full gap-1 items-center pl-2">
    {#each recordings as recording, idx}
      {#key recording.ID}
        <Recording
          dot={dots[idx]}
          {recording}
          onDelete={recording =>
            validationSets.removeValidationRecording(recording.ID)} />
      {/key}
    {/each}
  </div>
</GestureCard>

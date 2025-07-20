<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { derived } from 'svelte/store';
  import Card from '../../components/ui/Card.svelte';
  import Gesture from '../../lib/domain/stores/gesture/Gesture';
  import type { GestureID } from '../../lib/domain/stores/gesture/Gesture';
  import { stores } from '../../lib/stores/Stores';
  import Recording from '../../components/ui/recording/Recording.svelte';

  export let gesture: Gesture;

  const validationSets = stores.getValidationSets();
  const gestureValidationSet = stores.getValidationSets().getForGesture(gesture.getId());
  // Results are grouped by gestures then recordings [i][j](Gestures -> Recording)
  const results = stores.getValidationResults();
  const enableFingerprint = stores.getEnableFingerprint();

  $: recordings = $gestureValidationSet.recordings;

  const dotGetter = derived(results, res => {
    const getDot = (
      recordingId: number,
    ): { gesture: GestureID; color: string } | undefined => {
      // recordingId -> Gesture
      const resultGesture = results.getEvaluatedGesture(recordingId);

      if (!resultGesture) {
        return undefined;
      }

      return {
        gesture: resultGesture.getId(),
        color: resultGesture.getColor(),
      };
    };
    return getDot;
  });
</script>

<Card validationPage={true} small>
  <div class="flex flex-row h-full gap-1 items-center pl-2">
    {#each recordings as recording}
      {#key recording.ID}
        <Recording
          enableFingerprint={$enableFingerprint}
          dot={$dotGetter(recording.ID)}
          gestureId={$gesture.ID}
          {recording}
          onDelete={recording =>
            validationSets.removeValidationRecording(recording.ID)} />
      {/key}
    {/each}
  </div>
</Card>

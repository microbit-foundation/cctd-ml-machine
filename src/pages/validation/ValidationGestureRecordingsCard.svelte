<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { derived } from 'svelte/store';
  import Card from '../../components/ui/Card.svelte';
  import Recording from '../../components/ui/recording/Recording.svelte';
  import type GestureState from '../../lib/domain/stores/gesture/GestureState';
  import type { GestureID } from '../../core/entities/Gesture';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';

  export let gestureId: GestureID;

  const gestureController = getControllers().getGestureController();
  const gesture = gestureController.getGestureState(gestureId);
  const validationController = getControllers().getValidationController();
  const validationRecordings = $gesture.getValidationRecordings();
  const results = validationController.getValidationResult();
  const enableFingerprint = getControllers().getDataController().isFingerprintEnabled();

  const dotGetter = derived(results, res => {
    const getDot = (
      recordingId: number,
    ): { gesture: GestureID; color: string } | undefined => {
      // recordingId -> Gesture
      const resultGesture = gestureController.getGestureFromRecording(recordingId);

      if (!resultGesture) {
        return undefined;
      }

      return {
        gesture: resultGesture.getID(),
        color: resultGesture.getColor(),
      };
    };
    return getDot;
  });
</script>

<Card validationPage={true} small>
  <div class="flex flex-row h-full gap-1 items-center pl-2">
    {#each validationRecordings as recording}
      {#key recording.getId()}
        <Recording
          enableFingerprint={$enableFingerprint}
          dot={$dotGetter(recording.getId())}
          gestureId={$gesture.getID()}
          {recording}
          onDelete={recording =>
            gestureController.deleteValidationRecording(
              $gesture.getID(),
              recording.getId(),
            )} />
      {/key}
    {/each}
  </div>
</Card>

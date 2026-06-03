<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { derived } from 'svelte/store';
  import Card from '../../components/ui/Card.svelte';
  import Recording from '../../components/ui/recording/Recording.svelte';
  import type { GestureID } from '../../core/entities/Gesture';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
    import Matrix from '../../core/entities/Matrix';

  export let gestureId: GestureID;

  const gestureController = getControllers().getGestureController();
  const gesture = gestureController.getGestureState(gestureId);
  const validationController = getControllers().getValidationController();
  $: validationRecordings = $gesture.getValidationRecordings();
  const results = validationController.getValidationResult();
  const enableFingerprint = getControllers().getDataController().isFingerprintEnabled();

  const dotGetter = derived(results, res => {
    const getDot = (
      recordingId: number,
    ): { gesture: GestureID; color: string } | undefined => {
      // recordingId -> Gesture
      const resultGesture = gestureController.getGestureFromValidationRecording(recordingId);
      if (!resultGesture || !res) {
        return undefined;
      }


      const indexOfRecording = resultGesture.getValidationRecordings().findIndex(rec => rec.getId() === recordingId);

      const classIndex = gestureController.getClassIndex(resultGesture.getID());
      if (classIndex == null) {
        throw new Error("Something went wrong, could find gesture, but not it's class index");
      }
      const bucket = res.getConfusionBuckets()[classIndex];
      const predicted = bucket[indexOfRecording];

      const predirectedGesture = gestureController.getGestureFromClassIndex(predicted);
      if (!predirectedGesture) {
        return undefined;
      }

      return {
        gesture: predirectedGesture.getID(),
        color: predirectedGesture.getColor(),
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

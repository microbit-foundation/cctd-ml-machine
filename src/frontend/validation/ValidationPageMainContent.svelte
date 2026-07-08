<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import ValidationGestureNameCard from './ValidationGestureNameCard.svelte';
  import ValidationPageInformationLabels from './ValidationPageInformationLabels.svelte';
  import ValidationGestureSelectGestureCard from './ValidationGestureSelectGestureCard.svelte';
  import ValidationGestureRecordingsCard from './ValidationGestureRecordingsCard.svelte';
  import ValidationPageRecordingIndicator from './ValidationPageRecordingIndicator.svelte';
  import ValidationPageTutorial from './ValidationPageTutorial.svelte';
  import { tr } from '../../i18n';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';

  const gestureController = getControllers().getGestureController();
  const gestures = gestureController.getGestures();
  const selectedGesture = gestureController.getSelectedGesture();
  const validationRecordings = gestureController.getValidationRecordings();
  export let onNoMicrobitSelect: () => void;
</script>

{#if $gestures.length !== 0}
  <div class="p-3 gap-2 grid grid-cols-[max(200px,20%)_140px_1fr]">
    <ValidationPageInformationLabels />

    {#each $gestures as gesture, idx}
      <div class="col-start-1">
        <ValidationGestureNameCard gestureId={gesture.getID()} />
      </div>

      <div class="col-start-2">
        <ValidationPageRecordingIndicator gestureId={gesture.getID()} />
        <ValidationGestureSelectGestureCard
          gestureId={gesture.getID()}
          {onNoMicrobitSelect} />
      </div>

      <div class="col-start-3">
        {#if $validationRecordings.length > 0}
          <ValidationGestureRecordingsCard gestureId={gesture.getID()} />
        {:else if $selectedGesture?.getID() === gesture.getID() || (!$selectedGesture && idx === 0)}
          <ValidationPageTutorial />
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <div class="p-3 flex flex-col justify-center items-center min-h-full">
    <div class="flex flex-col gap-4 max-w-400px">
      <p class="text-lg font-bold">
        {$tr('content.validation.noGestures.title')}
      </p>
      <p class="">
        {$tr('content.validation.noGestures.description')}
      </p>
    </div>
  </div>
{/if}

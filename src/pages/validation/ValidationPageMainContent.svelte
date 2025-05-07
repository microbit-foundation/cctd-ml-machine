<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { stores } from '../../lib/stores/Stores';
  import ValidationGestureNameCard from './ValidationGestureNameCard.svelte';
  import ValidationPageInformationLabels from './ValidationPageInformationLabels.svelte';
  import ValidationGestureSelectGestureCard from './ValidationGestureSelectGestureCard.svelte';
  import ValidationGestureRecordingsCard from './ValidationGestureRecordingsCard.svelte';
  import ValidationPageRecordingIndicator from './ValidationPageRecordingIndicator.svelte';
  import { isValidationSetEmpty } from './ValidationPage';
  import ValidationPageTutorial from './ValidationPageTutorial.svelte';
  import { chosenGesture } from '../../lib/stores/uiStore';
  import { tr } from '../../i18n';

  const gestures = stores.getGestures();
  export let onNoMicrobitSelect: () => void;
</script>

{#if $gestures.length !== 0}
  <div class="p-3 gap-2 grid grid-cols-[max(200px,20%)_140px_1fr]">
    <ValidationPageInformationLabels />

    {#each stores.getGestures().getGestures() as gesture, idx}
      <div class="col-start-1">
        <ValidationGestureNameCard gesture={gestures.getGesture(gesture.getId())} />
      </div>

      <div class="col-start-2">
        <ValidationPageRecordingIndicator gestureId={gesture.getId()} />
        <ValidationGestureSelectGestureCard {gesture} {onNoMicrobitSelect} />
      </div>

      <div class="col-start-3">
        {#if !$isValidationSetEmpty}
          <ValidationGestureRecordingsCard {gesture} />
        {:else if $chosenGesture?.getId() === gesture.getId() || (!$chosenGesture && idx === 0)}
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

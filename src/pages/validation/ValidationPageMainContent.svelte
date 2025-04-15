<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { stores } from '../../script/stores/Stores';
  import ValidationGestureNameCard from './ValidationGestureNameCard.svelte';
  import ValidationPageInformationLabels from './ValidationPageInformationLabels.svelte';
  import ValidationGestureSelectGestureCard from './ValidationGestureSelectGestureCard.svelte';
  import ValidationGestureRecordingsCard from './ValidationGestureRecordingsCard.svelte';
  import ValidationPageRecordingIndicator from './ValidationPageRecordingIndicator.svelte';
  import { isValidationSetEmpty } from './ValidationPage';
  import ValidationPageTutorial from './ValidationPageTutorial.svelte';
  import { chosenGesture } from '../../script/stores/uiStore';

  const gestures = stores.getGestures();
  export let onNoMicrobitSelect: () => void;
</script>

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

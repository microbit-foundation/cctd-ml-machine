<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import GestureCard from '../../components/GestureCard.svelte';
  import type Gesture from '../../script/domain/stores/gesture/Gesture';
  import { chosenGesture } from '../../script/stores/uiStore';
  import { t } from '../../i18n';
  import { state, stores } from '../../script/stores/Stores';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { startRecording } from '../../script/utils/Recording';

  export let gesture: Gesture;
  const validationSets = stores.getValidationSets();
  export let onNoMicrobitSelect: () => void;

  const selectClicked = (gesture: Gesture): void => {
    if (!$state.isInputConnected) {
      chosenGesture.update(gesture => {
        gesture = null;
        return gesture;
      });
      onNoMicrobitSelect();
      return;
    }
    chosenGesture.update(chosen => {
      if (chosen === gesture) {
        chosen = null;
      } else {
        chosen = gesture;
      }
      return chosen;
    });
  };

</script>

<GestureCard small>
  {#if $chosenGesture?.getId() !== gesture.getId()}
    <div class="text-center w-35 cursor-pointer" on:click={() => selectClicked(gesture)}>
      <div class="w-full text-center">
        <i class="w-full h-full m-0 mt-4 p-2 fas fa-plus fa-2x text-primarytext" />
      </div>
      <p class="w-full text-center">
        {$t('content.data.addData')}
      </p>
    </div>
  {:else}
    <div class="text-center w-35 cursor-pointer" on:click={() => selectClicked(gesture)}>
      <div class="w-full text-center">
        <i class="w-full h-full m-0 mt-4 p-2 fas fa-check fa-2x text-secondary" />
      </div>
      <StandardButton
        onClick={e => {
          e.stopPropagation();
          startRecording(recording => {
            validationSets.addRecording(gesture.getId(), recording)
          });
        }}
        small
        shadows={false}
        outlined
        fillOnHover>
        {$t('content.data.record')}
      </StandardButton>
    </div>
  {/if}
</GestureCard>

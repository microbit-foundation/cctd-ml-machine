<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import GestureCard from '../../components/GestureCard.svelte';
  import type Gesture from '../../script/domain/stores/gesture/Gesture';
  import {
    buttonPressed,
    chosenGesture,
    microbitInteraction,
    MicrobitInteractions,
  } from '../../script/stores/uiStore';
  import { t } from '../../i18n';
  import { state, stores } from '../../script/stores/Stores';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { startRecording } from '../../script/utils/Recording';
  import StaticConfiguration from '../../StaticConfiguration';
  import { get } from 'svelte/store';
    import Logger from '../../script/utils/Logger';

  export let gesture: Gesture;
  const validationSets = stores.getValidationSets();
  export let onNoMicrobitSelect: () => void;
  let isThisRecording = false;

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

  const createRecording = (buttons?: { buttonA: 0 | 1; buttonB: 0 | 1 }) => {
    // Make sure only *this* gesture get's the recording indicator
    if (gesture.getId() !== $chosenGesture?.getId()) {
      return;
    }

    if (isThisRecording) {
      Logger.warn("ValidationGestureSelectGestureCard", "Already recording")
      return;
    }
    isThisRecording = true;
    const addRecording = () => {
      startRecording(recording => {
        isThisRecording = false;
        validationSets.addRecording(gesture.getId(), recording);
      });
    };

    if (!buttons) {
      addRecording();
      return;
    }

    const triggerButton = get(microbitInteraction);
    if (
      triggerButton === MicrobitInteractions.AB ||
      (buttons.buttonA && triggerButton === MicrobitInteractions.A) ||
      (buttons.buttonB && triggerButton === MicrobitInteractions.B)
    ) {
      addRecording();
    }
  };

  let declaring = true;
  $: {
    // Handle button press recordings. When first mounting, declare is true, therefore it won't call, only subsequently will this happen
    if (!declaring) {
      // Do not call when component is mounted
      createRecording($buttonPressed);
    } else {
      declaring = false;
    }
  }
</script>

<div class="relative w-[calc(100vw-320px)] left-[-220px]">
  <div class="absolute w-full left-0">
    <div
      class="bg-red-600 h-1.5 rounded-full absolute mt-123px ml-14px left-0"
      style={isThisRecording
        ? `transition:  ${(StaticConfiguration.recordingDuration / 1000).toString()}s linear; width: 97%;`
        : 'width:0;'} />
  </div>
</div>
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
          createRecording();
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

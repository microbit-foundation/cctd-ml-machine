<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import GestureCard from '../../components/ui/Card.svelte';
  import {
    buttonPressed,
    chosenGesture,
    microbitInteraction,
    MicrobitInteractions,
  } from '../../lib/stores/uiStore';
  import { t } from '../../i18n';
  import { stores } from '../../lib/stores/Stores';
  import { get } from 'svelte/store';
  import ConsoleLogger from '../../core/logging/ConsoleLogger';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import type { Gesture, GestureID } from '../../core/entities/Gesture';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';

  export let gestureId: GestureID;
  const gestureController = getControllers().getGestureController();
  const gesture = gestureController.getGestureState(gestureId);

  export let onNoMicrobitSelect: () => void;

  const devices = stores.getDevices();
  const validationSets = stores.getValidationSets();
  const recorder = stores.getRecorder();

  $: isThisRecording = $recorder.recordingGesture === $gesture.getID();

  const selectClicked = (gesture: Gesture): void => {
    if (!$devices.isInputConnected) {
      chosenGesture.update(gesture => {
        gesture = null;
        return gesture;
      });
      onNoMicrobitSelect();
      return;
    }
    chosenGesture.update(chosen => {
      if (chosen === gesture.getID()) {
        chosen = null;
      } else {
        chosen = gesture.getID();
      }
      return chosen;
    });
  };

  const createRecording = (buttons?: { buttonA: 0 | 1; buttonB: 0 | 1 }) => {
    // Make sure only *this* gesture get's the recording indicator
    if ($gesture.getID() !== $chosenGesture) {
      return;
    }

    if (isThisRecording) {
      ConsoleLogger.warn('ValidationGestureSelectGestureCard', 'Already recording');
      return;
    }
    const addRecording = () => {
      recorder.startRecording($gesture.getID(), recording => {
        validationSets.addRecording($gesture.getID(), recording);
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

<GestureCard validationPage small>
  {#if $chosenGesture !== $gesture.getID()}
    <div class="text-center w-35 cursor-pointer" on:click={() => selectClicked($gesture)}>
      <div class="w-full text-center">
        <i class="w-full h-full m-0 mt-4 p-2 fas fa-plus fa-2x text-primarytext" />
      </div>
      <p class="w-full text-center">
        {$t('content.data.addData')}
      </p>
    </div>
  {:else}
    <div class="text-center w-35 cursor-pointer" on:click={() => selectClicked($gesture)}>
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

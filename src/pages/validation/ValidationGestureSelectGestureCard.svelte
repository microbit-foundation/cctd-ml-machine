<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import GestureCard from '../../components/ui/Card.svelte';
  import {
    buttonPressed,
    microbitInteraction,
    MicrobitInteractions,
  } from '../../lib/stores/uiStore';
  import { t } from '../../i18n';
  import { get } from 'svelte/store';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import ConsoleLogger from '../../core/logging/ConsoleLogger';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import type { GestureID, NewGesture } from '../../core/entities/NewGesture';

  export let gestureId: GestureID;
  export let onNoMicrobitSelect: () => void;

  const recordingController = getControllers().getRecordingController();
  const recordingState = recordingController.getRecordingState();
  const gestureController = getControllers().getGestureController();
  const gesture = gestureController.getGestureState(gestureId);
  const selectedGesture = gestureController.getSelectedGesture();

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();

  $: isThisRecording =
    $recordingState.getRecordingGesture()?.getID() === $gesture.getID();

  const selectClicked = (gesture: NewGesture): void => {
    if (!$microbitConnection.getInput().isConnected()) {
      gestureController.selectGesture(undefined);
      onNoMicrobitSelect();
      return;
    }
    if ($selectedGesture?.getID() === gesture.getID()) {
      gestureController.selectGesture(undefined);
    } else {
      gestureController.selectGesture(gesture);
    }
  };

  const createRecording = (buttons?: { buttonA: 0 | 1; buttonB: 0 | 1 }) => {
    // Make sure only *this* gesture get's the recording indicator
    if ($gesture.getID() !== $selectedGesture?.getID()) {
      return;
    }

    if (isThisRecording) {
      ConsoleLogger.warn('ValidationGestureSelectGestureCard', 'Already recording');
      return;
    }
    const addRecording = () => {
      getControllers().getRecordingController().startRecording($gesture);
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
  {#if $selectedGesture?.getID() !== $gesture.getID()}
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

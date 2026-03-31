<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
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
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import ConsoleLogger from '../../core/logging/ConsoleLogger';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import type { GestureID, NewGesture } from '../../core/entities/NewGesture';
  import type { AbstractState } from '../../backend/statemanagement/AbstractState';
  import { RecordingImpl } from '../../core/entities/recording/RecordingImpl';
  import { Sample } from '../../core/entities/recording/Sample';
  import { strArrToAxisArr } from '../../core/entities/Axis';

  export let gestureId: GestureID;
  export let onNoMicrobitSelect: () => void;

  const recorder = stores.getRecorder();
  const gestureController = getControllers().getGestureController();
  const gesture = gestureController.getGestureState(gestureId);

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();

  $: isThisRecording = $recorder.recordingGesture === $gesture.getID();

  const selectClicked = (gesture: NewGesture): void => {
    if (!$microbitConnection.getInput().isConnected()) {
      chosenGesture.update(gesture => {
        gesture = null;
        return gesture;
      });
      onNoMicrobitSelect();
      return;
    }
    chosenGesture.update(chosen => {
      if (chosen?.getID() === gesture.getID()) {
        return null;
      }
      return gesture;
    });
  };

  const createRecording = (buttons?: { buttonA: 0 | 1; buttonB: 0 | 1 }) => {
    // Make sure only *this* gesture get's the recording indicator
    if ($gesture.getID() !== $chosenGesture?.getID()) {
      return;
    }

    if (isThisRecording) {
      ConsoleLogger.warn('ValidationGestureSelectGestureCard', 'Already recording');
      return;
    }
    const addRecording = () => {
      recorder.startRecording($gesture.getID(), recording => {
        const rec = new RecordingImpl(
          recording.ID,
          recording.samples.map(data => new Sample(data.vector)),
          strArrToAxisArr(recording.labels),
        );
        gestureController.addRecording($gesture.getID(), rec);
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
  {#if $chosenGesture?.getID() !== $gesture.getID()}
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

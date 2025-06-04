<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { get } from 'svelte/store';
  import {
    alertUser,
    buttonPressed,
    areActionsAllowed,
    microbitInteraction,
    MicrobitInteractions,
    chosenGesture,
  } from '../../../lib/stores/uiStore';
  import Recording from '../../ui/Recording.svelte';
  import { t } from '../../../i18n';
  import ImageSkeleton from '../../ui/skeletonloading/ImageSkeleton.svelte';
  import GestureCard from '../../ui/Card.svelte';
  import StaticConfiguration from '../../../StaticConfiguration';
  import Gesture from '../../../lib/domain/stores/gesture/Gesture';
  import { stores } from '../../../lib/stores/Stores';
  import type { RecordingData } from '../../../lib/domain/RecordingData';
  import { startRecording } from '../../../lib/utils/Recording';
  import GestureDot from '../../ui/GestureDot.svelte';
  import StandardButton from '../../ui/buttons/StandardButton.svelte';

  export let onNoMicrobitSelect: () => void;
  export let gesture: Gesture;
  const devices = stores.getDevices();
  const gestures = stores.getGestures();

  const defaultNewName = $t('content.data.classPlaceholderNewClass');
  const recordingDuration = StaticConfiguration.recordingDuration;

  let isThisRecording = false;

  const nameBind = gesture.bindName();

  // When title is clicked. Remove name
  function titleClicked(): void {
    if (gesture.getName() === defaultNewName) {
      gesture.setName('');
    }
  }

  function removeClicked(): void {
    if (!areActionsAllowed(false)) {
      return;
    }

    if (
      !window.confirm($t('alert.deleteGestureConfirm') + '"' + gesture.getName() + '"?')
    ) {
      return;
    }

    setTimeout(() => {
      gestures.removeGesture(gesture.getId());
    }, 450);
  }

  // method for recording data point for that specific gesture
  function recordClicked(e?: Event): void {
    e?.stopPropagation();
    if (!areActionsAllowed()) {
      return;
    }
    isThisRecording = true;
    startRecording(recording => {
      isThisRecording = false;
      gesture.addRecording(recording);
    });
  }

  // Delete recording from recordings array
  function deleteRecording(recording: RecordingData) {
    if (!areActionsAllowed(false)) {
      return;
    }
    gesture.removeRecording(recording.ID);
  }

  // Selecting this gesture for recording. Updates settings accordingly
  // If gesture is already selected, the selection is removed.
  // If bluetooth is not connected, open connection prompt by calling callback
  function selectClicked(): void {
    if (!$devices.isInputConnected) {
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
  }

  // When microbit buttons are pressed, this is called
  // Assess whether settings match with button-clicked.
  // If so, the gesture calls the recording function.
  function triggerButtonsClicked(buttons: { buttonA: 0 | 1; buttonB: 0 | 1 }): void {
    if ($chosenGesture !== gesture) {
      return;
    }
    const triggerButton = get(microbitInteraction);
    if (
      triggerButton === MicrobitInteractions.AB ||
      (buttons.buttonA && triggerButton === MicrobitInteractions.A) ||
      (buttons.buttonB && triggerButton === MicrobitInteractions.B)
    )
      recordClicked();
  }

  function onTitleKeypress(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      event.preventDefault();
      if (event.target instanceof HTMLElement) {
        event.target.blur();
      }
      return true;
    }

    if ($nameBind.length >= StaticConfiguration.gestureNameMaxLength) {
      event.preventDefault();
      alertUser(
        $t('alert.data.classNameLengthAlert', {
          values: {
            maxLen: StaticConfiguration.gestureNameMaxLength,
          },
        }),
      );
      return false;
    }
  }

  // Make function depend on buttonsPressed store.
  let declaring = true;
  $: {
    if (!declaring) {
      // Do not call when component is mounted
      triggerButtonsClicked($buttonPressed);
    } else {
      declaring = false;
    }
  }
</script>

<div class="flex-row flex">
  <!-- Recordingbar to show recording-progress -->

  <div
    class="bg-red-600 h-1.5 rounded-full absolute mt-123px ml-14px"
    style={isThisRecording
      ? `transition:  ${(recordingDuration / 1000).toString()}s linear; width: 97%;`
      : 'width:0;'} />

  <div class="items-center flex relative">
    <!-- Title of gesture-->
    <GestureCard mr small>
      <div class="top-3 left-3 absolute">
        <GestureDot {gesture} />
      </div>
      <div class="grid grid-cols-5 place-items-center p-2 w-50 h-30">
        <div
          class="w-40 col-start-2 col-end-5 text-center
									font-semibold transition ease
									rounded-xl border border-gray-300
									border-solid hover:bg-gray-100">
          <h3
            contenteditable
            bind:innerText={$nameBind}
            on:click={titleClicked}
            on:keypress={onTitleKeypress} />
        </div>
        <button class="pl-3 col-start-5 place-self-start justify-self-end outline-none">
          <i
            class="far fa-times-circle fa-lg text-light-800 hover:text-black transition ease"
            on:click={removeClicked} />
        </button>
      </div>
    </GestureCard>

    <GestureCard small mr elevated={$chosenGesture === gesture}>
      {#if $chosenGesture !== gesture}
        <div class="text-center w-35 cursor-pointer" on:click={selectClicked}>
          <div class="w-full text-center">
            <i class="w-full h-full m-0 mt-4 p-2 fas fa-plus fa-2x text-primarytext" />
          </div>
          <p class="w-full text-center">
            {$t('content.data.addData')}
          </p>
        </div>
      {:else}
        <div class="text-center w-35 cursor-pointer" on:click={selectClicked}>
          <div class="w-full text-center">
            <i class="w-full h-full m-0 mt-4 p-2 fas fa-check fa-2x text-secondary" />
          </div>
          <StandardButton
            onClick={recordClicked}
            small
            shadows={false}
            outlined
            fillOnHover>{$t('content.data.record')}</StandardButton>
        </div>
      {/if}
    </GestureCard>
    <!-- Show recording for each recording -->
    {#if $gesture.recordings.length > 0}
      <GestureCard small>
        <div class="flex p-2 h-30">
          {#each $gesture.recordings as recording (String($gesture.ID) + String(recording.ID))}
            <Recording {recording} onDelete={deleteRecording} />
          {/each}
        </div>
      </GestureCard>
    {:else if $chosenGesture === gesture}
      <GestureCard small>
        <div class="relative float-left text-left h-30 w-60 justify-start flex">
          <div class="text-left float-left mt-auto mb-auto ml-3">
            <ImageSkeleton
              height={95}
              width={140}
              src="/imgs/microbit_record_guide.svg"
              alt="microbit recording guide" />
          </div>
          <p class=" text-center absolute w-60px right-23px top-30px">
            {$t('content.index.recordButtonDescription')}
          </p>
        </div>
      </GestureCard>
    {/if}
  </div>
</div>

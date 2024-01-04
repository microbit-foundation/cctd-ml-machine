<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { get } from 'svelte/store';
  import {
    alertUser,
    buttonPressed,
    areActionsAllowed,
    state,
    microbitInteraction,
    MicrobitInteractions,
  } from '../script/stores/uiStore';
  import { chosenGesture, type RecordingData } from '../script/stores/mlStore';
  import Recording from './Recording.svelte';
  import { t } from '../i18n';
  import StandardButton from './StandardButton.svelte';
  import ImageSkeleton from './skeletonloading/ImageSkeleton.svelte';
  import GestureTilePart from './GestureTilePart.svelte';
  import StaticConfiguration from '../StaticConfiguration';
  import Gesture from '../script/domain/Gesture';
  import { classifier, gestures, liveAccelerometerData } from '../script/stores/Stores';

  // Variables for component
  export let onNoMicrobitSelect: () => void;
  export let gesture: Gesture;

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

    $state.isRecording = true;
    isThisRecording = true;

    // New array for data
    let newData: { x: number[]; y: number[]; z: number[] } = { x: [], y: [], z: [] };

    // Set timeout to allow recording in 1s
    const unsubscribe = liveAccelerometerData.subscribe(data => {
      newData.x.push(data.x);
      newData.y.push(data.y);
      newData.z.push(data.z);
    });

    // Once duration is over (1000ms default), stop recording
    setTimeout(() => {
      $state.isRecording = false;
      isThisRecording = false;
      unsubscribe();
      if (StaticConfiguration.pollingPredictionSampleSize <= newData.x.length) {
        const recording = { ID: Date.now(), data: newData } as RecordingData;
        gesture.addRecording(recording);
      } else {
        alertUser($t('alert.recording.disconnectedDuringRecording'));
      }
    }, recordingDuration);
  }

  // Delete recording from recordings array
  function deleteRecording(recording: RecordingData) {
    // TODO: Altering the recording data should mark the model as untrained, this should not be a manual
    if (!areActionsAllowed(false)) {
      return;
    }
    gesture.removeRecording(recording.ID);
  }

  // Selecting this gesture for recording. Updates settings accordingly
  // If gesture is already selected, the selection is removed.
  // If bluetooth is not connected, open connection prompt by calling callback
  function selectClicked(): void {
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
  }

  // When microbit buttons are pressed, this is called
  // Assess whether settings match with button-clicked.
  // If so, the gesture calls the recording function.
  function triggerButtonsClicked(buttons: { buttonA: 0 | 1; buttonB: 0 | 1 }): void {
    const triggerButton = get(microbitInteraction);
    if ($chosenGesture !== gesture) {
      return;
    }
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

<main class="flex-row flex mb-2">
  <!-- Recordingbar to show recording-progress -->

  <div
    class="bg-red-600 h-1.5 rounded-full absolute mt-123px ml-14px"
    style={isThisRecording
      ? 'transition: ' +
        /* TODO: Clean this up! : */ (recordingDuration / 1000).toString() +
        's linear; width: 97%;'
      : 'width:0;'} />

  <div class="items-center flex mb-1">
    <!-- Title of gesture-->
    <GestureTilePart mr small>
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
    </GestureTilePart>

    <GestureTilePart small mr elevated={$chosenGesture === gesture}>
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
    </GestureTilePart>
    <!-- Show recording for each recording -->
    {#if $gesture.recordings.length > 0}
      <GestureTilePart small>
        <div class="flex p-2 h-30">
          {#each $gesture.recordings as recording (String($gesture.ID) + String(recording.ID))}
            <Recording {recording} onDelete={deleteRecording} />
          {/each}
        </div>
      </GestureTilePart>
    {:else if $chosenGesture === gesture}
      <GestureTilePart small>
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
      </GestureTilePart>
    {/if}
  </div>
</main>

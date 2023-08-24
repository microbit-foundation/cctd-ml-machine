<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { get } from 'svelte/store';
  import TrainModelFirstTitle from '../../components/TrainModelFirstTitle.svelte';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
  import { areActionsAllowed, buttonPressed, state } from '../../script/stores/uiStore';
  import { settings } from '../../script/stores/mlStore';
  import { classify } from '../../script/ml';
  import { onMount } from 'svelte';
  import Microbits from '../../script/microbit-interfacing/Microbits';
  import { gestures } from '../../script/stores/mlStore';
  import OutputGestureTile from '../../components/output/OutputGestureTile.svelte';

  // In case of manual classification, variables for evaluation
  let recordingTime = 0;
  // let lastRecording;

  // Bool flags to know whether output microbit popup should be show
  let hasClosedPopup = false;
  let hasInteracted = false;

  function onUserInteraction(): void {
    hasInteracted = true;
  }

  /**
   * Classify based on button click
   */
  // method for recording gesture for that specific gesture
  function classifyClicked() {
    if (!areActionsAllowed()) return;

    $state.isRecording = true;
    // lastRecording = undefined;

    // Get duration
    const duration = get(settings).duration;

    // Loading interval
    const loadingInterval = setInterval(() => {
      recordingTime++;
    }, duration / 30);

    // TODO: Clean this up to avoid 'firstMount' hack
    // Once duration is over (1000ms default), stop recording
    setTimeout(() => {
      clearInterval(loadingInterval);
      // lastRecording = getPrevData();
      $state.isRecording = false;
      recordingTime = 0;
      classify();
    }, duration);
  }

  // When microbit buttons are pressed, this is called
  // Assess whether settings match with button-clicked.
  // If so, the gesture calls the recording function.
  function triggerButtonsClicked(buttons: { buttonA: 0 | 1; buttonB: 0 | 1 }) {
    if (firstMount) {
      return;
    }

    let shouldClassify: boolean =
      !get(settings).automaticClassification &&
      (buttons.buttonA === 1 || buttons.buttonB === 1);

    if (shouldClassify) {
      classifyClicked();
    }
  }

  let firstMount = true;
  onMount(() => {
    firstMount = false;
    Microbits.resetIOPins();
  });

  $: triggerButtonsClicked($buttonPressed);
</script>

<main class="h-full flex flex-col">
  {#if $state.isPredicting}
    <div>
      <ControlBar />
    </div>
    <div>
      {#each $gestures as gesture}
        <OutputGestureTile {gesture} {onUserInteraction} />
      {/each}
    </div>
  {:else}
    <TrainModelFirstTitle />
  {/if}
</main>

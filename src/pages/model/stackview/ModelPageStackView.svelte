<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { buttonPressed, areActionsAllowed } from '../../../lib/stores/uiStore';
  import { onMount } from 'svelte';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import TrainModelFirstTitle from '../../../components/features/model/TrainModelFirstTitle.svelte';
  import ModelPageStackViewContent from './ModelPageStackViewContent.svelte';
  import StaticConfiguration from '../../../StaticConfiguration';
  import { state, stores } from '../../../lib/stores/Stores';
  import PleaseConnect from '../../../components/features/PleaseConnect.svelte';

  const classifier = stores.getClassifier();
  // In case of manual classification, variables for evaluation
  let recordingTime = 0;

  /**
   * Classify based on button click
   */
  // method for recording gesture for that specific gesture
  function classifyClicked() {
    if (!areActionsAllowed()) return;

    $state.isRecording = true;
    // lastRecording = undefined;

    // Get duration
    const duration = StaticConfiguration.recordingDuration;

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
      // classify();
    }, duration);
  }

  // When microbit buttons are pressed, this is called
  // Assess whether settings match with button-clicked.
  // If so, the gesture calls the recording function.
  function triggerButtonsClicked(buttons: { buttonA: 0 | 1; buttonB: 0 | 1 }) {
    if (firstMount) {
      return;
    }

    let shouldClassify: boolean = buttons.buttonA === 1 || buttons.buttonB === 1;

    if (shouldClassify) {
      classifyClicked();
    }
  }

  let firstMount = true;
  onMount(() => {
    firstMount = false;
    Microbits.resetIOPins();
  });

  const model = classifier.getModel();

  $: triggerButtonsClicked($buttonPressed);
</script>

<!-- Main pane -->
<main class="h-full flex flex-col">
  {#if $model.isTrained}
    {#if $state.isInputReady}
      <ModelPageStackViewContent />
    {:else}
      <PleaseConnect />
    {/if}
  {:else}
    <TrainModelFirstTitle />
  {/if}
</main>

<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { areActionsAllowed, buttonPressed } from '../../../lib/stores/uiStore';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import MediaQuery from '../../../components/layout/MediaQuery.svelte';
  import StaticConfiguration from '../../../StaticConfiguration';
  import { state, stores } from '../../../lib/stores/Stores';
  import OutputGesture from '../../../components/features/model/ModelGesture.svelte';

  // In case of manual classification, variables for evaluation
  let recordingTime = 0;
  // let lastRecording;

  // Bool flags to know whether output microbit popup should be show
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

  $: triggerButtonsClicked($buttonPressed);
</script>

<MediaQuery query="(max-width: 1000px)" let:matches>
  {#if matches}
    <div class="grid grid-cols-3 gap-4">
      {#each stores.getGestures().getGestures() as gesture}
        <OutputGesture {gesture} {onUserInteraction} variant={'tile'} />
      {/each}
    </div>
  {/if}
</MediaQuery>
<MediaQuery query="(min-width: 1000px) and (max-width: 1367px)" let:matches>
  {#if matches}
    <div class="grid grid-cols-4 gap-4">
      {#each stores.getGestures().getGestures() as gesture}
        <OutputGesture {gesture} {onUserInteraction} variant={'tile'} />
      {/each}
    </div>
  {/if}
</MediaQuery>
<MediaQuery query="(min-width: 1367px)" let:matches>
  {#if matches}
    <div class="grid grid-cols-5 gap-4">
      {#each stores.getGestures().getGestures() as gesture}
        <OutputGesture {gesture} {onUserInteraction} variant={'tile'} />
      {/each}
    </div>
  {/if}
</MediaQuery>

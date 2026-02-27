<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import TrainModelFirstTitle from '../../../components/features/model/TrainModelFirstTitle.svelte';
  import { areActionsAllowed, buttonPressed } from '../../../lib/stores/uiStore';
  import { onMount } from 'svelte';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import ModelPageTileViewTiles from './ModelPageTileViewTiles.svelte';
  import { stores } from '../../../lib/stores/Stores';
  import { Feature, getFeature } from '../../../lib/FeatureToggles';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import MakeCodeProjectBlocks from '../../../components/features/makecode/MakeCodeProjectBlocks.svelte';
  import { navigate, Paths } from '../../../router/Router';
  import { t } from 'svelte-i18n';

  const devices = stores.getDevices();
  const classifier = stores.getClassifier();

  const makecodeController = getControllers().getMakeCodeController();
  const outputController = getControllers().getOutputController();

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

    $devices.isRecording = true;
    // lastRecording = undefined;

    // Get duration
    const duration = getFeature<number>(Feature.RECORDING_DURATION);

    // Loading interval
    const loadingInterval = setInterval(() => {
      recordingTime++;
    }, duration / 30);

    // TODO: Clean this up to avoid 'firstMount' hack
    // Once duration is over (1000ms default), stop recording
    setTimeout(() => {
      clearInterval(loadingInterval);
      // lastRecording = getPrevData();
      $devices.isRecording = false;
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

  const openMakeCode = () => {
    navigate(Paths.MAKECODE);
    outputController.setOutputTargetMakecode();
  };

  $: triggerButtonsClicked($buttonPressed);

  const model = classifier.getModel();
</script>

<main class="px-4 pt-4 flex flex-grow">
  <div class="flex-col flex-grow">
    {#if !$model.hasModel}
      <TrainModelFirstTitle />
    {:else}
      <ModelPageTileViewTiles />
      {#if !makecodeController.hasProjectBeenChanged()}
        <div
          class="flex flex-row mt-12 mx-30 bg-backgroundlight border-secondary border-1 p-4 rounded justify-center shadow-xl">
          <div class="flex flex-col">
            <p class="text-md font-bold text-primary text-center">
              {$t('content.model.makecode.heading')}
            </p>
            <p class="text-sm">
              {$t('content.model.makecode.description')}
              <span on:click={openMakeCode} class="text-secondary cursor-pointer">
                {$t('content.model.makecode.heading')}
              </span>
            </p>
          </div>
        </div>
      {:else}
        <div class="mt-2 bg-backgroundlight rounded-md p-1 shadow-sm text-xs">
          <div class="pb-2">
            <span class="underline cursor-pointer text-sm" on:click={openMakeCode}
              >{$t('content.model.makecode.edit')}</span>
          </div>
          <MakeCodeProjectBlocks />
        </div>
      {/if}
    {/if}
  </div>
</main>

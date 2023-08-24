<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<style>
  input[type='range'][orient='vertical'] {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    width: 20px;
    background: #13bba4;
  }
</style>

<script lang="ts">
  // IMPORT AND DEFAULTS
  import OutputMatrix from './OutputMatrix.svelte';
  import {
    settings,
    gestureConfidences,
    type GestureData,
  } from '../../script/stores/mlStore';
  import { t } from '../../i18n';
  import Microbits from '../../script/microbit-interfacing/Microbits';
  import GestureTilePart from '../GestureTilePart.svelte';
  import { state } from '../../script/stores/uiStore';
  import StaticConfiguration from '../../StaticConfiguration';
  import Information from '../information/Information.svelte';
  import ConnectionBehaviours from '../../script/connection-behaviours/ConnectionBehaviours';
  import CookieManager from '../../script/CookieManager';

  type TriggerAction = 'turnOn' | 'turnOff' | 'none';

  // Variables for component
  export let gesture: GestureData;

  let wasTriggered = false;

  let requiredConfidence = StaticConfiguration.defaultRequiredConfidence;
  $: currentConfidence = $state.isInputReady ? $gestureConfidences[gesture.ID] : 0;

  const getTriggerAction = (
    lastWasTriggered: boolean,
    confidence: number,
    requiredConfidence: number,
  ): TriggerAction => {
    let isConfident = requiredConfidence <= confidence * 100;
    if ((!lastWasTriggered || !$settings.automaticClassification) && isConfident) {
      return 'turnOn';
    }
    if (lastWasTriggered && !isConfident) {
      return 'turnOff';
    }
    return 'none';
  };

  const wasTurnedOn = () => {
    // TODO: Will be removed in the future - see https://github.com/microbit-foundation/cctd-ml-machine/issues/305 @amh
    if (CookieManager.hasFeatureFlag('mkcd')) {
      if (Microbits.isOutputMakecode()) {
        ConnectionBehaviours.getOutputBehaviour().onGestureRecognized(
          gesture.ID,
          gesture.name,
        );
        return;
      }
    }
    wasTriggered = true;
  };

  const handleTriggering = (action: TriggerAction) => {
    if (action === 'none') {
      return;
    }
    if (action === 'turnOn') {
      wasTurnedOn();
    } else {
      wasTriggered = false;
    }
  };

  $: {
    let triggerAction = getTriggerAction(
      wasTriggered,
      currentConfidence,
      requiredConfidence,
    );
    handleTriggering(triggerAction);
  }
  console.log(wasTriggered);
</script>

<main class="pl-3 mb-4 items-center flex flex-row">
  <!-- NAMES AND CONFIDENCE METER -->
  <GestureTilePart>
    <div class="items-center flex p-2">
      <div
        class="w-36 text-center font-semibold rounded-xl
                    px-1 py-1 border border-gray-300
                    border-dashed mr-2 break-words">
        <h3>{gesture.name}</h3>
      </div>
      <div class="h-31" />
      <input
        class="h-25 rotate-90 accent-primary"
        type="range"
        orient="vertical"
        name=""
        min="10"
        max="90"
        id=""
        bind:value={requiredConfidence} />

      <!-- METER -->
      <div class="w-4 h-25 relative">
        <div
          class="w-4 h-full absolute rounded border border-solid border-gray-400 overflow-hidden">
          <div
            class="absolute w-5 {currentConfidence < requiredConfidence
              ? 'bg-primary'
              : 'bg-info'} z-index: -10"
            style="height: {100 * currentConfidence}px; margin-top: {100 -
              100 * currentConfidence}px;" />
          <div
            class="absolute w-5 bg-primary"
            style="height: 1px; margin-top: {6.5 - 0.068 * requiredConfidence}rem;" />
          <div class="absolute">
            {#each [75, 50, 25] as line}
              <div class="w-5 bg-gray-300 mt-6" style="height: 1px;">
                <p class="absolute text-xs" style="margin-top: -8px; margin-left: 18px;">
                  {line}%
                </p>
              </div>
            {/each}
          </div>
          <div />
        </div>
      </div>
      <div class="relative self-start">
        <Information
          titleText={$t('content.model.classification.helpHeading')}
          bodyText={$t('content.model.classification.helpBody')}
          isLightTheme={false} />
      </div>
    </div>
  </GestureTilePart>
</main>

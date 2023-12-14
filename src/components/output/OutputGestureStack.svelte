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
    updateGestureSoundOutput,
    type SoundData,
    updateGesturePinOutput,
  } from '../../script/stores/mlStore';
  import { t } from '../../i18n';
  import OutputSoundSelector from './OutputSoundSelector.svelte';
  import Microbits from '../../script/microbit-interfacing/Microbits';
  import ImageSkeleton from '../skeletonloading/ImageSkeleton.svelte';
  import GestureTilePart from '../GestureTilePart.svelte';
  import PinSelector from './PinSelector.svelte';
  import { state } from '../../script/stores/uiStore';
  import StaticConfiguration from '../../StaticConfiguration';
  import Information from '../information/Information.svelte';
  import { PinTurnOnState } from './PinSelectorUtil';
  import MBSpecs from '../../script/microbit-interfacing/MBSpecs';
  import Gesture from '../../script/domain/Gesture';

  type TriggerAction = 'turnOn' | 'turnOff' | 'none';

  // Variables for component
  export let gesture: Gesture;
  export let onUserInteraction: () => void = () => {
    return;
  };
  let wasTriggered = false;
  let triggerFunctions: (() => void)[] = [];
  let selectedSound: SoundData | undefined = $gesture.output.sound;
  let selectedPin: MBSpecs.UsableIOPin = $gesture.output.outputPin
    ? $gesture.output.outputPin.pin
    : StaticConfiguration.defaultOutputPin;

  let pinIOEnabled = StaticConfiguration.pinIOEnabledByDefault;
  let turnOnTime = $gesture.output.outputPin
    ? $gesture.output.outputPin.turnOnTime
    : StaticConfiguration.defaultPinToggleTime;
  let turnOnState = $gesture.output.outputPin
    ? $gesture.output.outputPin.pinState
    : StaticConfiguration.defaultPinTurnOnState;

  let requiredConfidence = StaticConfiguration.defaultRequiredConfidence;

  const getTriggerAction = (
    lastWasTriggered: boolean,
    confidence: number,
    requiredConfidence: number,
  ): TriggerAction => {
    let isConfident = requiredConfidence <= confidence;
    if ((!lastWasTriggered || !$settings.automaticClassification) && isConfident) {
      return 'turnOn';
    }
    if (lastWasTriggered && !isConfident) {
      return 'turnOff';
    }
    return 'none';
  };

  const wasTurnedOn = () => {
    triggerComponents();
    playSound();
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

    if (!pinIOEnabled) {
      return;
    }
    const shouldTurnPinOn = action === 'turnOn';
    setOutputPin(shouldTurnPinOn);
  };

  $: {
    let triggerAction = getTriggerAction(
      wasTriggered,
      $gesture.confidence.currentConfidence,
      $gesture.confidence.requiredConfidence,
    );
    handleTriggering(triggerAction);
  }

  function setOutputPin(on: boolean) {
    if (!Microbits.isOutputReady()) {
      return;
    }

    const isOnTimer = turnOnState === PinTurnOnState.X_TIME;
    if (on) {
      Microbits.sendToOutputPin([{ pin: selectedPin, on: true }]);
      // If pin is on timer, set timeout to turn off again
      if (isOnTimer) {
        setTimeout(() => {
          Microbits.sendToOutputPin([{ pin: selectedPin, on: false }]);
        }, turnOnTime);
      }
    } else if (!isOnTimer) {
      // else if on === false and the pin is not on a timer, turn it off
      Microbits.sendToOutputPin([{ pin: selectedPin, on: false }]);
    }
  }

  function onSoundSelected(sound: SoundData | undefined): void {
    selectedSound = sound;
    updateGestureSoundOutput($gesture.ID, sound);
    onUserInteraction();
  }

  function playSound() {
    if (selectedSound === undefined) {
      return;
    }
    if (!Microbits.isOutputAssigned()) {
      return;
    }

    if (Microbits.getAssignedOutput().getVersion() === 1) {
      const sound = new Audio(selectedSound.path);
      void sound.play();
    } else {
      void Microbits.sendUARTSoundMessageToOutput(selectedSound.id);
    }
  }

  const onPinSelect = (selected: MBSpecs.UsableIOPin) => {
    if (selected === selectedPin) {
      pinIOEnabled = !pinIOEnabled;
    }
    selectedPin = selected;
    refreshAfterChange();
    updateGesturePinOutput($gesture.ID, selectedPin, turnOnState, turnOnTime);
  };

  const triggerComponents = () =>
    triggerFunctions.forEach(triggerFunc => {
      triggerFunc();
    });

  const onTurnOnTimeSelect = (state: {
    turnOnState: PinTurnOnState;
    turnOnTime: number;
  }) => {
    turnOnState = state.turnOnState;
    turnOnTime = state.turnOnTime;
    refreshAfterChange();
    updateGesturePinOutput($gesture.ID, selectedPin, turnOnState, turnOnTime);
    if (wasTriggered) {
      setOutputPin(true);
    }
  };

  const refreshAfterChange = () => {
    Microbits.resetIOPins();
    setOutputPin(false);
  };

  let sliderValue = requiredConfidence * 100;
  $: {
    gesture.getConfidence().setRequiredConfidence(sliderValue / 100);
  }

  let hasLoadedMicrobitImage = false;

  $: meterHeightPct = 100 * $gesture.confidence.currentConfidence;

  const noTypeCheckNonStandardOrientProp = (orient?: 'vertical' | 'horizontal'): any => ({
    orient,
  });
</script>

<main class="mb-4 items-center flex flex-row">
  <!-- NAMES AND CONFIDENCE METER -->
  <GestureTilePart>
    <div class="items-center flex p-2">
      <div
        class="w-36 text-center font-semibold rounded-xl
                    px-1 py-1 border border-gray-300
                    border-dashed mr-2 break-words">
        <h3>{$gesture.name}</h3>
      </div>
      <div class="h-31" />
      <input
        class="h-25 rotate-90 accent-primary"
        type="range"
        {...noTypeCheckNonStandardOrientProp('vertical')}
        name=""
        min="10"
        max="90"
        id=""
        bind:value={sliderValue} />

      <!-- METER -->
      <div class="w-4 h-25 relative">
        <div
          class="w-4 h-full absolute rounded border border-solid border-gray-400 overflow-hidden">
          <div
            class="absolute w-5 {wasTriggered ? 'bg-primary' : 'bg-info'} z-index: -10"
            style="height: {meterHeightPct}px; margin-top: {100 - meterHeightPct}px;" />
          <div
            class="absolute w-5 bg-primary"
            style="height: 1px; margin-top: {6.5 - 0.068 * sliderValue}rem;" />
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

  <!-- ARROW -->
  <div class="text-center w-15">
    <img
      class="m-auto"
      class:hidden={wasTriggered}
      src={'imgs/right_arrow.svg'}
      alt="right arrow icon"
      width="30px" />
    <img
      class="m-auto"
      class:hidden={!wasTriggered || !$state.isInputReady}
      src={'imgs/right_arrow_blue.svg'}
      alt="right arrow icon"
      width="30px" />
  </div>

  <!-- OUTPUT SETTINGS -->
  <div class="relative flex items-center">
    <div
      class="w-177px relative rounded-xl bg-transparent h-full border-1 border-primaryborder">
      <ImageSkeleton
        src="imgs/blank_microbit.svg"
        alt="microbit guide"
        width={177}
        height={144}
        loadingColorSecondary="#818181"
        loadingColorPrimary="#4A4A4A"
        onLoaded={() => (hasLoadedMicrobitImage = true)} />
      <div
        class="bg-black p-0 m-0 absolute top-9 left-12.7"
        class:hidden={!hasLoadedMicrobitImage}
        on:click={onUserInteraction}>
        <OutputMatrix bind:trigger={triggerFunctions[0]} gesture={$gesture} />
      </div>
    </div>
    <OutputSoundSelector onSoundSelection={onSoundSelected} {selectedSound} />
  </div>
  <div class="ml-4">
    <PinSelector
      selectedPin={pinIOEnabled ? selectedPin : undefined}
      {turnOnState}
      {turnOnTime}
      {onPinSelect}
      {onTurnOnTimeSelect} />
  </div>
</main>

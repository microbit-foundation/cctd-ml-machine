<style>
  .layout-grid {
    display: grid;
    grid-template-columns: 13rem 3rem 1fr;
  }

  input[type='range'][orient='vertical'] {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    width: 20px;
    background: #13bba4;
  }

  .arrow-triggered-color {
    filter: invert(31%) sepia(20%) saturate(4422%) hue-rotate(194deg) brightness(88%)
      contrast(82%);
  }

  .arrow-base-color {
    filter: invert(30%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%)
      contrast(100%);
  }
</style>

<script lang="ts">
  // IMPORT AND DEFAULTS
  import OutputMatrix from './output/OutputMatrix.svelte';
  import {
    settings,
    gestureConfidences,
    updateGestureSoundOutput,
    type GestureData,
    type SoundData,
  } from '../script/stores/mlStore';
  import { t } from '../i18n';
  import TextInformation from './information/TextInformation.svelte';
  import OutputSoundSelector from './output/OutputSoundSelector.svelte';
  import Microbits from '../script/microbit-interfacing/Microbits';
  import ImageSkeleton from './skeletonloading/ImageSkeleton.svelte';
  import GestureTilePart from "./GestureTilePart.svelte";

  // Variables for component
  export let gesture: GestureData;
  export let onUserInteraction: () => void = () => {
    return;
  };
  let triggered = false;
  let triggerFunctions: (() => void)[] = [];
  let selectedSound: SoundData | undefined = gesture.output.sound;

  let requiredConfidenceLevel = 80;
  // $: gesture.output.sound = selectedSound

  // $: if (shouldTrigger(requiredConfidenceLevel, confidenceLevel, triggered)) triggerComponnets();
  $: if (
    shouldTrigger(requiredConfidenceLevel, $gestureConfidences[gesture.ID], triggered)
  ) {
    triggerComponnets();
    playSound();
  }

  function onSoundSelected(sound: SoundData | undefined): void {
    selectedSound = sound;
    updateGestureSoundOutput(gesture.ID, sound);
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
      void Microbits.sendToOutputUart('s', selectedSound.id);
    }
  }

  function shouldTrigger(
    requiredConfidence: number,
    confidence: number,
    oldTriggered: boolean,
  ) {
    triggered = requiredConfidence <= confidence * 100;
    if (!triggered) return false;
    if (!$settings.automaticClassification) return true;
    if (oldTriggered) return false;
    return true;
  }

  const triggerComponnets = () =>
    triggerFunctions.forEach(triggerFunc => {
      triggerFunc();
    });

  let hasLoadedMicrobitImage = false;
</script>

<main class="pl-3 mb-4 justify-center items-center layout-grid">
  <!-- NAMES AND CONFIDENCE METER -->
  <GestureTilePart>
  <div class="items-center flex p-2">
    <div
      class="w-36 text-center font-semibold rounded-xl
                    px-1 py-1 border border-gray-300
                    border-dashed mr-2 break-words">
      <h3>{gesture.name}</h3>
    </div>
    <div class="h-31"></div>
    <input
      class="h-25 rotate-90 accent-primary"
      type="range"
      orient="vertical"
      name=""
      min="10"
      max="90"
      id=""
      bind:value="{requiredConfidenceLevel}" />

    <!-- METER -->
    <div class="w-4 h-25 relative">
      <div
        class="w-4 h-full absolute rounded border border-solid border-gray-400 overflow-hidden">
        <div
          class="absolute w-5 {triggered ? 'bg-primary' : 'bg-info'} z-index: -10"
          style="height: {100 * $gestureConfidences[gesture.ID]}px; margin-top: {100 -
            100 * $gestureConfidences[gesture.ID]}px;">
        </div>
        <div
          class="absolute w-5 bg-primary"
          style="height: 1px; margin-top: {6.5 - 0.068 * requiredConfidenceLevel}rem;">
        </div>
        <div class="absolute">
          {#each [75, 50, 25] as line}
            <div class="w-5 bg-gray-300 mt-6" style="height: 1px;">
              <p class="absolute text-xs" style="margin-top: -8px; margin-left: 18px;">
                {line}%
              </p>
            </div>
          {/each}
        </div>
        <div></div>
      </div>
    </div>
    <div class="relative self-start">
      <TextInformation
        titleText="{$t('content.model.classification.helpHeading')}"
        bodyText="{$t('content.model.classification.helpBody')}"
        isLightTheme="{false}" />
    </div>
  </div>
  </GestureTilePart>

  <!-- ARROW -->
  <div class="text-center ml-auto mr-auto">
    <img
      class="m-auto"
      class:arrow-base-color="{!triggered}"
      class:arrow-triggered-color="{triggered}"
      src="{'imgs/right_arrow.svg'}"
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
        width="{177}"
        height="{144}"
        loadingColorSecondary="#818181"
        loadingColorPrimary="#4A4A4A"
        onLoaded="{() => (hasLoadedMicrobitImage = true)}" />
      <div
        class="bg-black p-0 m-0 absolute top-9 left-12.7"
        class:hidden="{!hasLoadedMicrobitImage}"
        on:click="{onUserInteraction}">
        <OutputMatrix bind:trigger="{triggerFunctions[0]}" gesture="{gesture}" />
      </div>
    </div>
    <OutputSoundSelector
      onSoundSelection="{onSoundSelected}"
      selectedSound="{selectedSound}" />
  </div>
</main>

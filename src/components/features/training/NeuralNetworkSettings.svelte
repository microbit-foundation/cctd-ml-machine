<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import windi from '../../../../windi.config';
  import RangeSlider from 'svelte-range-slider-pips';
  import NumberSelector from '../../ui/NumberSelector.svelte';
  import { Feature, hasFeature } from '../../../lib/FeatureToggles';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';

  const neuralNetworkController = getControllers().getNeuralNetworkController();
  const neuralNetworkSettings = neuralNetworkController.getNeuralNetworkSettings();
  const color = windi.theme.extend.colors.primary;

  let learningRateSliderValue = $neuralNetworkSettings
    .getLearningSettings()
    .getLearningRate();
  $: {
    neuralNetworkController.setLearningRate(learningRateSliderValue);
  }
</script>

{#if hasFeature(Feature.MODEL_SETTINGS)}
  <div class="text-sm grid gap-1 gap-x-2 grid-cols-[1fr,1fr]">
    <p class="whitespace-nowrap content-center">Learning rate</p>
    <div
      class="flex flex-col justify-center"
      style="font-size:0.6rem; --range-handle-inactive: {color}; --range-handle: {color}; --range-handle-focus: {color}">
      <RangeSlider
        bind:value={learningRateSliderValue}
        min={0.01}
        max={1.0}
        float
        step={0.01}
        springValues={{ damping: 0.9, stiffness: 0.5, precision: 0.1 }} />
    </div>

    <p class="whitespace-nowrap content-center">Epochs</p>
    <div class="justify-self-center px-2">
      <NumberSelector
        min={1}
        max={1000}
        defaultValue={$neuralNetworkSettings.getLearningSettings().getNumberOfEpochs()}
        onChange={val => neuralNetworkController.setNumberOfEpochs(val)} />
    </div>

    <p class="whitespace-nowrap content-center">Nodes</p>
    <div class="justify-self-center">
      <NumberSelector
        min={1}
        max={200}
        defaultValue={$neuralNetworkSettings
          .getArchitecture()
          .getHiddenLayers()[0]
          .getNumberOfNodes()}
        onChange={val => neuralNetworkController.setNumberOfUnits(val)} />
    </div>

    <p class="whitespace-nowrap content-center">Batch size</p>
    <div class="justify-self-center">
      <NumberSelector
        min={1}
        max={30}
        defaultValue={$neuralNetworkSettings.getLearningSettings().getBatchSize()}
        onChange={val => neuralNetworkController.setBatchSize(val)} />
    </div>
  </div>
{/if}

<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  import windi from './../../../../windi.config.js';
  import NumberSelector from '../../../components/ui/NumberSelector.svelte';
  import { stores } from '../../../lib/stores/Stores.js';
  import ModelRegistry from '../../../lib/domain/ModelRegistry.js';
  import { selectModel } from '../TrainingPage.js';
  import StandardDropdownButton from '../../../components/ui/buttons/StandardDropdownButton.svelte';

  export let isSelected: boolean;
  const color = windi.theme.extend.colors.primary;
  const neuralNetworkSettings = stores.getNeuralNetworkSettings();
  let learningRateSliderValue = $neuralNetworkSettings.learningRate;
  let validationSplitSliderValue = $neuralNetworkSettings.validationSplit;

  $: {
    neuralNetworkSettings.setLearningRate(learningRateSliderValue);
  }
  $: {
    neuralNetworkSettings.setValidationSplit(validationSplitSliderValue);
  }
</script>

<StandardDropdownButton
  onClick={() => {
    selectModel(ModelRegistry.NeuralNetwork);
  }}
  fillOnHover
  outlined={!isSelected}
  small>
  <p>Neural Network</p>

  <div slot="content" class="pb-2">
    <div class="flex flex-col">
      <div class="grid gap-1 gap-x-2 grid-cols-[1fr,1fr]">
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
            defaultValue={$neuralNetworkSettings.noOfEpochs}
            onChange={val => neuralNetworkSettings.setNoOfEpochs(val)} />
        </div>

        <p class="whitespace-nowrap content-center">Nodes</p>
        <div class="justify-self-center">
          <NumberSelector
            min={1}
            max={200}
            defaultValue={$neuralNetworkSettings.noOfUnits}
            onChange={val => neuralNetworkSettings.setNoOfUnits(val)} />
        </div>

        <p class="whitespace-nowrap content-center">Batch size</p>
        <div class="justify-self-center">
          <NumberSelector
            min={1}
            max={30}
            defaultValue={$neuralNetworkSettings.batchSize}
            onChange={val => neuralNetworkSettings.setBatchSize(val)} />
        </div>

        <!-- <p class="whitespace-nowrap content-center">Validation Split</p>
        <div
          class="w-30 flex flex-col justify-center"
          style="font-size:0.6rem; --range-handle-inactive: {color}; --range-handle: {color}; --range-handle-focus: {color}">
          <RangeSlider
            bind:value={validationSplitSliderValue}
            min={0.01}
            max={0.8}
            float
            step={0.01}
            springValues={{ damping: 0.9, stiffness: 0.5, precision: 0.1 }} />
        </div> -->
      </div>
    </div>
  </div>
</StandardDropdownButton>

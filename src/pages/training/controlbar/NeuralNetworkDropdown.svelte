<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  import StandardDropdownButton from '../../../components/buttons/StandardDropdownButton.svelte';
  import windi from './../../../../windi.config.js';
  import NumberSelector from '../../../components/NumberSelector.svelte';
  import { stores } from '../../../script/stores/Stores.js';

  export let isSelected: boolean;
  const color = windi.theme.extend.colors.primary;
  const neuralNetworkSettings = stores.getNeuralNetworkSettings();
  let learningRateSliderValue = $neuralNetworkSettings.learningRate;

  $: {
    neuralNetworkSettings.setLearningRate(learningRateSliderValue);
  }
</script>

<StandardDropdownButton fillOnHover outlined={!isSelected} small>
  <p>KNN Model</p>

  <div slot="content">
    <div class="flex flex-col">
      <div class="grid gap-1 grid-cols-[1fr,1fr]">
        <p class="whitespace-nowrap content-center">Learning rate</p>
        <div
          class="w-25 flex flex-col justify-center"
          style="font-size:0.6rem; --range-handle-inactive: {color}; --range-handle: {color}; --range-handle-focus: {color}">
          <RangeSlider
            bind:value={learningRateSliderValue}
            min={0.01}
            max={1.5}
            float
            step={0.01}
            springValues={{ damping: 0.9, stiffness: 0.5, precision: 0.1 }} />
        </div>

        <p class="whitespace-nowrap content-center">Epochs</p>
        <div class="justify-self-center">
          <NumberSelector
            min={1}
            max={400}
            defaultValue={$neuralNetworkSettings.noOfEpochs}
            onChange={val => neuralNetworkSettings.setNoOfEpochs(val)} />
        </div>
 
        <p class="whitespace-nowrap content-center">Nodes</p>
        <div class="justify-self-center">
          <NumberSelector
            min={1}
            max={30}
            defaultValue={$neuralNetworkSettings.noOfUnits}
            onChange={val => neuralNetworkSettings.setNoOfUnits(val)} />
        </div>
      </div>
    </div>
  </div>
</StandardDropdownButton>

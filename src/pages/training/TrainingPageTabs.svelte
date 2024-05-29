<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
  import { availableModels, selectedModel } from '../../script/stores/uiStore';

  const onSelectNeuralNetwork = () => {
    $selectedModel = availableModels.find(model => model.id === 'NN')!;
  };
  const onSelectKnn = () => {
    $selectedModel = availableModels.find(model => model.id === 'KNN')!;
  };
  $: isSelected = (id: string) => {
    return $selectedModel.id === id;
  };
</script>

<ControlBar expanded shadows={false}>
  <div class="flex flex-row flex-grow h-full">
    <!--Left controlbar-->
    <div
      on:click={onSelectNeuralNetwork}
      class:to-secondary={isSelected('NN')}
      class:to-primary={!isSelected('NN')}
      class:shadow-md={!isSelected('NN')}
      class="flex flex-col border-l-2 border-b-2 border-secondary justify-center cursor-pointer h-full self-center flex-1 bg-gradient-to-r via-primary from-primary text-secondarytext">
      <p class="text-center font-bold">Neural Network</p>
    </div>
    <!--Right controlbar-->
    <div
      on:click={onSelectKnn}
      class:to-secondary={isSelected('KNN')}
      class:to-primary={!isSelected('KNN')}
      class:shadow-md={!isSelected('KNN')}
      class="flex border-r-2 border-b-2 border-secondary flex-col justify-center cursor-pointer h-full self-center flex-1 bg-gradient-to-l via-primary from-primary text-secondarytext">
      <p class="text-center font-bold">KNN Model</p>
    </div>
  </div>
</ControlBar>

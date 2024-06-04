<!--
  (c) 2023, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->

<script lang="ts">
  import { selectedModel } from '../../script/stores/uiStore';
  import FiltersList from '../../components/filters/FiltersList.svelte';
  import KnnModelTrainingPageView from './KnnModelTrainingPageView.svelte';
  import ModelRegistry from '../../script/domain/ModelRegistry';
  import NeuralNetworkTrainingPageView from './NeuralNetworkTrainingPageView.svelte';
</script>

<div class="flex flex-col h-full justify-center">
  <div class="flex flex-row p-2">
    <FiltersList />
    {#if $selectedModel.id === ModelRegistry.KNN.id}
      <KnnModelTrainingPageView />
    {:else if $selectedModel.id === ModelRegistry.NeuralNetwork.id}
      <NeuralNetworkTrainingPageView />
    {/if}
  </div>
</div>

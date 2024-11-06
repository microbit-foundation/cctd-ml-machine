<!--
  (c) 2023, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->

<script lang="ts">
  import FiltersList from '../../components/filters/FiltersList.svelte';
  import KnnModelTrainingPageView from './KnnModelTrainingPageView.svelte';
  import ModelRegistry from '../../script/domain/ModelRegistry';
  import NeuralNetworkTrainingPageView from './NeuralNetworkTrainingPageView.svelte';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
    import { stores } from '../../script/stores/Stores';

  const selectedModel = stores.getSelectedModel();
  const showFilterList = hasFeature(Feature.KNN_MODEL);
</script>

<div class="flex flex-col h-full justify-center">
  <div class="flex flex-row p-2">
    {#if showFilterList}
      <FiltersList />
    {/if}
    {#if $selectedModel.id === ModelRegistry.KNN.id}
      <KnnModelTrainingPageView />
    {:else if $selectedModel.id === ModelRegistry.NeuralNetwork.id}
      <NeuralNetworkTrainingPageView />
    {/if}
  </div>
</div>

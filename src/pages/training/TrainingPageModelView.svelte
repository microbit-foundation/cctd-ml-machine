<!--
  (c) 2025, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->

<script lang="ts">
  import KnnModelTrainingPageView from './KnnModelTrainingPageView.svelte';
  import ModelRegistry from '../../lib/domain/ModelRegistry';
  import NeuralNetworkTrainingPageView from './NeuralNetworkTrainingPageView.svelte';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import { state, stores } from '../../lib/stores/Stores';
  import PleaseConnect from '../../components/PleaseConnect.svelte';
    import FiltersList from '../../components/features/filters/FiltersList.svelte';

  const selectedModel = stores.getSelectedModel();
  const showFilterList = hasFeature(Feature.KNN_MODEL);
</script>

<div class="flex flex-col h-full justify-center">
  <div class="flex flex-row p-2">
    {#if showFilterList}
      <FiltersList />
    {/if}
    {#if $selectedModel.id === ModelRegistry.KNN.id && $state.isInputConnected}
      <KnnModelTrainingPageView />
    {:else if $selectedModel.id === ModelRegistry.NeuralNetwork.id}
      <NeuralNetworkTrainingPageView />
    {/if}
  </div>
</div>
{#if !$state.isInputConnected}
  <div class="mt-5">
    <PleaseConnect />
  </div>
{/if}

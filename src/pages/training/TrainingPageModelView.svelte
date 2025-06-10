<!--
  (c) 2023-2025, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->

<script lang="ts">
  import KnnModelTrainingPageView from './KnnModelTrainingPageView.svelte';
  import ModelRegistry from '../../lib/domain/ModelRegistry';
  import NeuralNetworkTrainingPageView from './NeuralNetworkTrainingPageView.svelte';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import { stores } from '../../lib/stores/Stores';
  import PleaseConnect from '../../components/features/PleaseConnect.svelte';
  import FiltersList from '../../components/features/filters/FiltersList.svelte';
  import TrainingPageModelSettings from '../../components/features/training/TrainingPageModelSettings.svelte';

  const devices = stores.getDevices();
  const selectedModel = stores.getSelectedModel();
  const showFilterList = hasFeature(Feature.KNN_MODEL);
</script>

<div class="flex items-center flex-grow flex-row h-full">
  <div>
    {#if showFilterList}
      <FiltersList />
    {/if}
  </div>
  <div class="flex flex-grow justify-center flex-col gap-2">
    <TrainingPageModelSettings />
    <div class="flex flex-row p-2">
      {#if $selectedModel.id === ModelRegistry.KNN.id}
        <KnnModelTrainingPageView />
      {:else if $selectedModel.id === ModelRegistry.NeuralNetwork.id}
        <NeuralNetworkTrainingPageView />
      {/if}
    </div>
  </div>
</div>
{#if !$devices.isInputConnected}
  <div class="mt-4">
    <PleaseConnect />
  </div>
{/if}

<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import KnnModelTrainingPageView from './KnnModelTrainingPageView.svelte';
  import ModelRegistry from '../../core/entities/classifier/models/ModelRegistry';
  import NeuralNetworkTrainingPageView from './NeuralNetworkTrainingPageView.svelte';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import { stores } from '../../lib/stores/Stores';
  import PleaseConnect from '../../components/features/PleaseConnect.svelte';
  import FiltersList from '../../components/features/filters/FiltersList.svelte';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
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
    <div class="flex flex-row p-2">
      {#if $selectedModel.id === ModelRegistry.KNN.id}
        <KnnModelTrainingPageView />
      {:else if $selectedModel.id === ModelRegistry.NeuralNetwork.id}
        <NeuralNetworkTrainingPageView />
      {/if}
    </div>
  </div>
</div>
{#if !$microbitConnection.getInput().isConnected()}
  <div class="mt-4">
    <PleaseConnect />
  </div>
{/if}

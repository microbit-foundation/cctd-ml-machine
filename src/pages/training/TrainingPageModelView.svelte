<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import KnnModelTrainingPageView from './KnnModelTrainingPageView.svelte';
  import NeuralNetworkTrainingPageView from './NeuralNetworkTrainingPageView.svelte';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import PleaseConnect from '../../components/features/PleaseConnect.svelte';
  import FiltersList from '../../components/features/filters/FiltersList.svelte';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import { ModelType } from '../../core/model/ModelType';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
  const selectedModel = getControllers().getClassifierController().getSelectedModel();
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
      {#if $selectedModel.getType() === ModelType.KNN}
        <KnnModelTrainingPageView />
      {:else if $selectedModel.getType() === ModelType.NERUAL_NETWORK}
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

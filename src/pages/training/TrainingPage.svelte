<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import {
    ModelEntry,
    availableModels,
    preferredModel,
    state,
  } from '../../script/stores/uiStore';
  import { t } from '../../i18n';
  import PleaseConnectFirst from '../../components/PleaseConnectFirst.svelte';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
  import { Paths, navigate } from '../../router/paths';
  import TrainingFailedDialog from './TrainingFailedDialog.svelte';
  import TrainModelButton from './TrainModelButton.svelte';
  import { classifier, gestures } from '../../script/stores/Stores';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import KnnModelGraph from '../../components/graphs/knngraph/KnnModelGraph.svelte';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import LossGraph from '../../components/graphs/LossGraph.svelte';
  import { writable } from 'svelte/store';
  import { LossTrainingIteration } from '../../components/graphs/LossGraphUtil';
  import StaticConfiguration from '../../StaticConfiguration';
  import CookieManager from '../../script/CookieManager';
  import { appInsights } from '../../appInsights';

  const model = classifier.getModel();

  const filters = classifier.getFilters();

  const sufficientData = gestures.hasSufficientData();

  const selectedModelOption = hasFeature(Feature.KNN_MODEL)
    ? preferredModel
    : writable(availableModels[0]);

  $: isUsingKNNModel =
    hasFeature(Feature.KNN_MODEL) && $selectedModelOption.id === availableModels[1].id;

  const loss = writable<LossTrainingIteration[]>([]);

  const resetLoss = () => loss.set([]);

  const trainingIterationHandler = (h: LossTrainingIteration) => {
    loss.update(newLoss => {
      newLoss.push(h);
      return newLoss;
    });
  };

  const trackModelEvent = () => {
    if (CookieManager.getComplianceChoices().analytics) {
      appInsights.trackEvent({
        name: 'ModelTrained',
        properties: {
          modelType: $selectedModelOption.id,
        },
      });
    }
  };
</script>

<TrainingFailedDialog />
<div class="flex flex-col h-full">
  <ControlBar>
    <div class="min-h-12" />
    <StandardButton
      fillOnHover
      small
      outlined
      bold={false}
      shadows={false}
      color={'primary'}
      onClick={() => {
        navigate(Paths.FILTERS);
      }}>
      {$t('content.trainer.controlbar.filters')}
    </StandardButton>
  </ControlBar>
  <div class="flex flex-col flex-grow justify-center items-center text-center">
    {#if isUsingKNNModel}
      <KnnModelGraph />
    {/if}
    {#if !sufficientData}
      <div class="w-full text-primarytext">
        <h1 class="w-3/4 text-3xl bold m-auto">
          {$t('menu.trainer.notEnoughDataHeader1')}
        </h1>
        <p class="w-3/5 text-xl m-auto mt-5">
          {$t('menu.trainer.notEnoughDataInfoBody')}
        </p>
      </div>
    {:else}
      <div class="w-3/4 text-primarytext">
        {#if !$model.isTraining}
          {#if $filters.length == 0}
            <p class="bold text-xl bold mt-10">
              {$t('menu.trainer.noFilters')}
            </p>
          {:else}
            <div class="w-full pt-5 text-white pb-5">
              <TrainModelButton
                selectedOption={selectedModelOption}
                onClick={() => {
                  resetLoss();
                  trackModelEvent();
                }}
                onTrainingIteration={trainingIterationHandler} />
            </div>
          {/if}
        {/if}

        {#if $model.isTrained}
          <p class="bold text-3xl bold mt-5">
            {$t('menu.trainer.TrainingFinished')}
          </p>
          <p class="bold text-xl bold mt-5">
            {$t('menu.trainer.TrainingFinished.body')}
          </p>
        {/if}
        {#if $filters.length == 0}
          <p class="bold text-xl bold mt-10">
            {$t('menu.trainer.noFilters')}
          </p>
        {/if}
      </div>
    {/if}
    {#if !$state.isInputConnected && !isUsingKNNModel}
      <div class="mt-10">
        {#if $loss.length > 0 || $model.isTraining}
          {#if !CookieManager.hasFeatureFlag('loss-graph')}
            {#if $model.isTraining}
              <div
                class="flex flex-col flex-grow justify-center items-center text-center">
                <div class="w-3/4 text-primarytext">
                  <div class="ml-auto mr-auto flex center-items justify-center">
                    <i
                      class="fa fa-solid fa-circle-notch text-5xl animate-spin animate-duration-[2s]" />
                  </div>
                  <p class="bold text-3xl bold mt-10">
                    {$t('menu.trainer.isTrainingModelButton')}
                  </p>
                </div>
              </div>
            {/if}
          {:else}
            <LossGraph
              {loss}
              maxX={StaticConfiguration.layersModelTrainingSettings.noOfEpochs} />
          {/if}
        {/if}
      </div>
    {/if}
    {#if !$state.isInputConnected}
      <div class="mt-5">
        <PleaseConnectFirst />
      </div>
    {/if}
  </div>
</div>

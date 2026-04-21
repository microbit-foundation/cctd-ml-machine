<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { stores } from '../../lib/stores/Stores';
  import { trainNNModel } from './TrainingPage';
  import { t } from './../../i18n';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import LossGraph from '../../components/features/graphs/LossGraph.svelte';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import Tooltip from '../../components/ui/Tooltip.svelte';
  import NeuralNetworkSettings from '../../components/features/training/NeuralNetworkSettings.svelte';
  import ConsoleLogger from '../../core/logging/ConsoleLogger';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';

  const classifier = stores.getClassifier();
  const model = classifier.getModel();
  const highlightedAxes = getControllers().getAxisController().getSelectedAxes();
  const neuralNetworkController = getControllers().getNeuralNetworkController();
  const neuralNetworkSettings = neuralNetworkController.getNeuralNetworkSettings();
  const loss = neuralNetworkController.getTrainingIterations();

  const trainModelClickHandler = () => {
    trainNNModel().then(() => {
      ConsoleLogger.log('NeuralNetworkTrainingPageView', 'Model trained');
    });
  };

  $: trainButtonSimpleLabel = !$model.hasModel
    ? 'menu.trainer.trainModelButtonSimple'
    : 'menu.trainer.trainNewModelButtonSimple';
</script>

<div class="flex flex-row justify-center items-center flex-grow">
  <div class="flex ml-6">
    <NeuralNetworkSettings />
  </div>

  <div class="flex flex-col flex-grow justify-center items-center text-center">
    {#if $model.isTraining}
      <div class="ml-auto mr-auto flex center-items justify-center">
        <i
          class="fa fa-solid fa-circle-notch text-5xl animate-spin animate-duration-[2s]" />
      </div>
      {#if !hasFeature(Feature.LOSS_GRAPH)}
        <p class="text-2xl mt-3">{$t('menu.trainer.isTrainingModelButton')}</p>
      {/if}
    {:else}
      {#if $model.isTrained && !hasFeature(Feature.LOSS_GRAPH)}
        <p class="text-2xl">{$t('menu.trainer.TrainingFinished')}</p>
        <p class="text-lg mt-4 mb-4">{$t('menu.trainer.TrainingFinished.body')}</p>
      {/if}
      <div class="relative">
        <Tooltip
          disabled={$highlightedAxes.length !== 0}
          title={$t('menu.trainer.SelectMoreAxes')}
          offset={{ x: 5, y: -90 }}>
          <StandardButton
            disabled={$highlightedAxes.length === 0}
            onClick={trainModelClickHandler}>
            {$t(trainButtonSimpleLabel)}
          </StandardButton>
        </Tooltip>
      </div>
    {/if}
    {#if $loss.length > 0 && hasFeature(Feature.LOSS_GRAPH) && ($model.isTrained || $model.isTraining)}
      <LossGraph
        {loss}
        maxX={$neuralNetworkSettings.getLearningSettings().getNumberOfEpochs()} />
    {/if}
  </div>
</div>

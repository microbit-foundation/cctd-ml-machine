<!--
  (c) 2023-2025, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->
<script lang="ts">
  import { loss, trainNNModel } from './TrainingPage';
  import { t } from './../../i18n';
  import ConsoleLogger from '../../core/logging/ConsoleLogger';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import LossGraph from '../../components/features/graphs/LossGraph.svelte';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import Tooltip from '../../components/ui/Tooltip.svelte';
  import NeuralNetworkSettings from '../../components/features/training/NeuralNetworkSettings.svelte';
  import { svelteState } from '../../backend/interface-adapter/SvelteStateAdapter';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';

  const classifierController = getControllers().getClassifierController();
  const neuralNetworkSettings = svelteState(
    classifierController.getNeuralNetworkSettings(),
  );
  const modelTraining = svelteState(classifierController.getModelTraining());
  const classifier = svelteState(classifierController.getClassifier());
  const axisController = getControllers().getAxisController();

  const selectedAxes = svelteState(axisController.getSelectedAxes())

  const trainModelClickHandler = () => {
    trainNNModel().then(() => {
      ConsoleLogger.log('NeuralNetworkTrainingPageView', 'Model trained');
    });
  };

  $: isTrained = $classifier !== undefined

  $: trainButtonSimpleLabel = !isTrained
    ? 'menu.trainer.trainModelButtonSimple'
    : 'menu.trainer.trainNewModelButtonSimple';
</script>

<div class="flex flex-row justify-center items-center flex-grow">
  <div class="flex ml-6">
    <NeuralNetworkSettings neuralNetworkSettings={neuralNetworkSettings} />
  </div>

  <div class="flex flex-col flex-grow justify-center items-center text-center">
    {#if $modelTraining.isTraining()}
      <div class="ml-auto mr-auto flex center-items justify-center">
        <i
          class="fa fa-solid fa-circle-notch text-5xl animate-spin animate-duration-[2s]" />
      </div>
      {#if !hasFeature(Feature.LOSS_GRAPH)}
        <p class="text-2xl mt-3">{$t('menu.trainer.isTrainingModelButton')}</p>
      {/if}
    {:else}
      {#if isTrained && !hasFeature(Feature.LOSS_GRAPH)}
        <p class="text-2xl">{$t('menu.trainer.TrainingFinished')}</p>
        <p class="text-lg mt-4 mb-4">{$t('menu.trainer.TrainingFinished.body')}</p>
      {/if}
      <div class="relative">
        <Tooltip
          disabled={$selectedAxes.length !== 0}
          title={$t('menu.trainer.SelectMoreAxes')}
          offset={{ x: 5, y: -90 }}>
          <StandardButton
            disabled={$selectedAxes.length === 0}
            onClick={trainModelClickHandler}>
            {$t(trainButtonSimpleLabel)}
          </StandardButton>
        </Tooltip>
      </div>
    {/if}
    {#if $loss.length > 0 && hasFeature(Feature.LOSS_GRAPH) && (isTrained || $modelTraining.isTraining())}
      <LossGraph {loss} maxX={$neuralNetworkSettings.getNumberOfEpochs()} />
    {/if}
  </div>
</div>

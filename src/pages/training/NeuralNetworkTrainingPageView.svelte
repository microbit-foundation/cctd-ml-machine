<!--
  (c) 2023, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->
<script lang="ts">
  import { stores } from '../../lib/stores/Stores';
  import { loss, trainModel } from './TrainingPage';
  import { t } from './../../i18n';
  import ModelRegistry from '../../lib/domain/ModelRegistry';
  import Logger from '../../lib/utils/Logger';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import LossGraph from '../../components/features/graphs/LossGraph.svelte';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';

  const classifier = stores.getClassifier();
  const model = classifier.getModel();
  const highlightedAxes = stores.getHighlightedAxes();
  const neuralNetworkSettings = stores.getNeuralNetworkSettings();

  const trainModelClickHandler = () => {
    trainModel(ModelRegistry.NeuralNetwork).then(() => {
      Logger.log('NeuralNetworkTrainingPageView', 'Model trained');
    });
  };

  $: trainButtonSimpleLabel = !$model.hasModel
    ? 'menu.trainer.trainModelButtonSimple'
    : 'menu.trainer.trainNewModelButtonSimple';
</script>

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
    <StandardButton
      disabledTooltip={$t('menu.trainer.SelectMoreAxes')}
      disabled={$highlightedAxes.length === 0}
      onClick={trainModelClickHandler}>
      {$t(trainButtonSimpleLabel)}
    </StandardButton>
  {/if}
  {#if $loss.length > 0 && hasFeature(Feature.LOSS_GRAPH) && ($model.isTrained || $model.isTraining)}
    <LossGraph {loss} maxX={$neuralNetworkSettings.noOfEpochs} />
  {/if}
</div>

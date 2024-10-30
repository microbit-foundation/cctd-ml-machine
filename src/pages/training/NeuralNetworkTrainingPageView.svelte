<!--
  (c) 2023, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->
<script lang="ts">
  import { stores } from '../../script/stores/Stores';
  import { loss, trainModel } from './TrainingPage';
  import { t } from './../../i18n';
  import LossGraph from '../../components/graphs/LossGraph.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import ModelRegistry from '../../script/domain/ModelRegistry';
  import Logger from '../../script/utils/Logger';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import { onMount } from 'svelte';

  const classifier = stores.getClassifier();
  const model = classifier.getModel();
  const highlightedAxis = stores.getHighlightedAxis();

  const trainModelClickHandler = () => {
    trainModel(ModelRegistry.NeuralNetwork).then(() => {
      Logger.log('NeuralNetworkTrainingPageView', 'Model trained');
    });
  };

  $: trainButtonSimpleLabel = !$model.hasModel
    ? 'menu.trainer.trainModelButtonSimple'
    : 'menu.trainer.trainNewModelButtonSimple';

  onMount(() => {
    $highlightedAxis = undefined;
  });
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
    <StandardButton onClick={trainModelClickHandler}>
      {$t(trainButtonSimpleLabel)}
    </StandardButton>
  {/if}
  {#if $loss.length > 0 && hasFeature(Feature.LOSS_GRAPH)}
    <LossGraph {loss} maxX={StaticConfiguration.layersModelTrainingSettings.noOfEpochs} />
  {/if}
</div>

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
  import StaticConfiguration from '../../StaticConfiguration';
  import StandardDropdownButton from '../../components/buttons/StandardDropdownButton.svelte';
  import { DropdownOption } from '../../components/buttons/Buttons';
  import ModelTrainer from '../../script/domain/ModelTrainer';
  import MLModel from '../../script/domain/MLModel';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { FilterType } from '../../script/domain/FilterTypes';
  import Filters from '../../script/domain/Filters';
  import { Writable } from 'svelte/store';

  import { LossTrainingIteration } from '../../components/graphs/LossGraphUtil';
  import {
    ModelEntry,
    availableModels,
    highlightedAxis,
    prevHighlightedAxis,
  } from '../../script/stores/uiStore';
  import { stores } from '../../script/stores/Stores';
  import { onMount } from 'svelte';
  import { getModelTrainer, options, trainModel } from './TrainModelButton';
  import Axes from '../../script/domain/Axes';

  export let onTrainingIteration: (iteration: LossTrainingIteration) => void;
  export let onClick: () => void;

  export let selectedOption: Writable<DropdownOption>;

  const classifier = stores.getClassifier();

  const model = classifier.getModel();

  $: trainButtonLabel = !$model.hasModel
    ? 'menu.trainer.trainModelButton'
    : 'menu.trainer.trainNewModelButton';

  $: trainButtonSimpleLabel = !$model.hasModel
    ? 'menu.trainer.trainModelButtonSimple'
    : 'menu.trainer.trainNewModelButtonSimple';

  const getModelFromOption = (dropdownOption: DropdownOption) => {
    const modelFound: ModelEntry | undefined = availableModels.find(
      model => model.id === dropdownOption.id,
    );
    if (!modelFound) {
      throw new Error('Model not found!');
    }
    return modelFound;
  };

  const clickHandler = () => {
    stores.getEngine().stop();
    trainModel(selectedOption, onTrainingIteration);
    stores.getEngine().start();
    onClick();
  };

  const onSelect = (option: DropdownOption) => {
    selectedOption.set(option);
  };

  $: {
    if ($selectedOption.id === 'KNN' && !$highlightedAxis) {
      highlightedAxis.set(Axes.X);
    }
    if ($selectedOption.id === 'NN' && $highlightedAxis) {
      highlightedAxis.set(undefined);
    }
  }
</script>

{#if hasFeature(Feature.KNN_MODEL)}
  <StandardDropdownButton
    onClick={clickHandler}
    {onSelect}
    buttonText={$t(trainButtonLabel, {
      values: { model: getModelFromOption($selectedOption).label },
    })}
    defaultOptionSelected={$selectedOption}
    {options} />
{:else}
  <StandardButton onClick={clickHandler}>
    {$t(trainButtonSimpleLabel)}
  </StandardButton>
{/if}

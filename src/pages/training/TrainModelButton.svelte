<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import StandardDropdownButton from '../../components/buttons/StandardDropdownButton.svelte';
  import { type DropdownOption } from '../../components/buttons/Buttons';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { type Writable } from 'svelte/store';
  import { stores } from '../../script/stores/Stores';
  import { options, trainModel } from './TrainModelButton';
  import ModelRegistry, { type ModelInfo } from '../../script/domain/ModelRegistry';
  import { type LossTrainingIteration } from '../../script/mlmodels/LayersModelTrainer';

  export let onTrainingIteration: (iteration: LossTrainingIteration) => void;
  export let onClick: () => void;

  export let selectedOption: Writable<DropdownOption>;

  const classifier = stores.getClassifier();
  const highlightedAxis = stores.getHighlightedAxes();
  const availableAxes = stores.getAvailableAxes();

  const model = classifier.getModel();

  $: trainButtonLabel = !$model.hasModel
    ? 'menu.trainer.trainModelButton'
    : 'menu.trainer.trainNewModelButton';

  $: trainButtonSimpleLabel = !$model.hasModel
    ? 'menu.trainer.trainModelButtonSimple'
    : 'menu.trainer.trainNewModelButtonSimple';

  const getModelFromOption = (dropdownOption: DropdownOption) => {
    const modelFound: ModelInfo | undefined = ModelRegistry.getModels().find(
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
      highlightedAxis.set([$availableAxes[0]]);
    }
    if ($selectedOption.id === 'NN' && $highlightedAxis) {
      highlightedAxis.set([]);
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

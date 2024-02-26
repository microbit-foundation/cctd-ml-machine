<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import { classifier } from '../../script/stores/Stores';
  import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
  import StaticConfiguration from '../../StaticConfiguration';
  import StandardDropdownButton from '../../components/buttons/StandardDropdownButton.svelte';
  import KNNModelTrainer from '../../script/mlmodels/KNNModelTrainer';
  import { DropdownOption } from '../../components/buttons/Buttons';
  import PersistantWritable from '../../script/repository/PersistantWritable';
  import ModelTrainer from '../../script/domain/ModelTrainer';
  import MLModel from '../../script/domain/MLModel';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { FilterType } from '../../script/domain/FilterTypes';
  import Filters from '../../script/domain/Filters';
  import { ModelEntry, availableModels } from '../../script/stores/uiStore';

  export let selectedOption: PersistantWritable<DropdownOption>;

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

  const onClick = () => {
    const selectedModel = availableModels.find(model => model.id === $selectedOption.id);

    if (selectedModel?.id === 'KNN') {
      const knnFilters = [FilterType.MAX, FilterType.MIN, FilterType.STD];
      const filters: Filters = classifier.getFilters();
      filters.clear();
      for (const filter of knnFilters) {
        filters.add(filter);
      }
    }

    if (selectedModel) {
      model.train(selectedModel.trainer());
    }
  };

  const onSelect = (option: DropdownOption) => {
    selectedOption.set(option);
  };

  const options: DropdownOption[] = availableModels.map(model => {
    return {
      id: model.id,
      label: model.title,
    };
  });
</script>

{#if hasFeature(Feature.KNN_MODEL)}
  <StandardDropdownButton
    {onClick}
    {onSelect}
    buttonText={$t(trainButtonLabel, {
      values: { model: getModelFromOption($selectedOption).label },
    })}
    defaultOptionSelected={$selectedOption}
    {options} />
{:else}
  <StandardButton {onClick}>
    {$t(trainButtonSimpleLabel)}
  </StandardButton>
{/if}

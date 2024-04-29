<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import { classifier, gestures } from '../../script/stores/Stores';
  import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
  import StaticConfiguration from '../../StaticConfiguration';
  import StandardDropdownButton from '../../components/buttons/StandardDropdownButton.svelte';
  import KNNModelTrainer from '../../script/mlmodels/KNNModelTrainer';
  import { DropdownOption } from '../../components/buttons/Buttons';
  import ModelTrainer from '../../script/domain/ModelTrainer';
  import MLModel from '../../script/domain/MLModel';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { FilterType } from '../../script/domain/FilterTypes';
  import Filters from '../../script/domain/Filters';
  import { Writable } from 'svelte/store';

  export let selectedOption: Writable<DropdownOption>;
  import { LossTrainingIteration } from '../../components/graphs/LossGraphUtil';
  import {
    ModelEntry,
    availableModels,
    highlightedAxis,
    prevHighlightedAxis,
  } from '../../script/stores/uiStore';
  import Axes from '../../script/domain/Axes';
  import Logger from '../../script/utils/Logger';
  import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
  import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';

  export let onTrainingIteration: (iteration: LossTrainingIteration) => void;
  export let onClick: () => void;

  const getModelTrainer = (modelEntry: ModelEntry): ModelTrainer<MLModel> => {
    if (modelEntry.id === 'KNN') {
      if ($highlightedAxis === undefined) {
        highlightedAxis.set(Axes.X);
      }
      const noOfRecordings = gestures
        .getGestures()
        .map(gesture => gesture.getRecordings().length)
        .reduce((prev, cur) => cur + prev, 0);

      if (noOfRecordings / 2 < StaticConfiguration.knnNeighbourCount) {
        Logger.log(
          'TrainModelButton',
          'The number of recordings is probably too low for an effective KNN model if using ' +
            StaticConfiguration.knnNeighbourCount +
            ' neighbours ',
        );
      }

      const offset =
        $highlightedAxis === Axes.X ? 0 : $highlightedAxis === Axes.Y ? 1 : 2;

      return new KNNNonNormalizedModelTrainer(
        StaticConfiguration.knnNeighbourCount,
        data => extractAxisFromTrainingData(data, offset, 3),
      );
    }

    return new LayersModelTrainer(StaticConfiguration.layersModelTrainingSettings, h => {
      onTrainingIteration(h);
    });
  };

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
    const selectedModel = availableModels.find(model => model.id === $selectedOption.id);

    if (selectedModel?.id === 'KNN') {
      // TODO: We set the filters to 2 different filters giving us a 2d graph
      const knnFilters = [FilterType.MAX, FilterType.MEAN];
      const filters: Filters = classifier.getFilters();
      filters.clear();
      for (const filter of knnFilters) {
        filters.add(filter);
      }
    }

    if (selectedModel) {
      onClick();
      model.train(getModelTrainer(selectedModel));
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

  highlightedAxis.subscribe(axis => {
    if (!axis) {
      return;
    }
    if ($prevHighlightedAxis === axis) {
      return;
    }
    if ($selectedOption.id === 'KNN') {
      model.train(getModelTrainer(getModelFromOption($selectedOption)));
    }
    prevHighlightedAxis.set(axis);
  });
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

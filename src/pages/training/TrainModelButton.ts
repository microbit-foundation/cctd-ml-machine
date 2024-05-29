/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Writable, get } from 'svelte/store';
import { DropdownOption } from '../../components/buttons/Buttons';
import {
  ModelEntry,
  availableModels,
  highlightedAxis,
} from '../../script/stores/uiStore';
import ModelTrainer from '../../script/domain/ModelTrainer';
import MLModel from '../../script/domain/MLModel';
import Logger from '../../script/utils/Logger';
import Axes from '../../script/domain/Axes';
import { stores } from '../../script/stores/Stores';
import StaticConfiguration from '../../StaticConfiguration';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
import { LossTrainingIteration } from '../../components/graphs/LossGraphUtil';
import { FilterType } from '../../script/domain/FilterTypes';
import Filters from '../../script/domain/Filters';

const gestures = stores.getGestures();
const classifier = stores.getClassifier();

export const options: DropdownOption[] = availableModels.map(model => {
  return {
    id: model.id,
    label: model.title,
  };
});

export const getModelTrainer = (
  modelEntry: ModelEntry,
  onTrainingIteration: (iteration: LossTrainingIteration) => void,
): ModelTrainer<MLModel> => {
  const currentAxis = get(highlightedAxis);
  if (modelEntry.id === 'KNN') {
    const offset = currentAxis === Axes.X ? 0 : currentAxis === Axes.Y ? 1 : 2;
    return new KNNNonNormalizedModelTrainer(StaticConfiguration.knnNeighbourCount, data =>
      extractAxisFromTrainingData(data, offset, 3),
    );
  }
  highlightedAxis.set(undefined);

  return new LayersModelTrainer(StaticConfiguration.layersModelTrainingSettings, h => {
    onTrainingIteration(h);
  });
};

export const trainModel = (
  selectedOption: Writable<DropdownOption>,
  onTrainingIteration: (iteration: LossTrainingIteration) => void,
) => {
  const selectedModel = availableModels.find(
    model => model.id === get(selectedOption).id,
  );
  const model = classifier.getModel();

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
    model.train(getModelTrainer(selectedModel, onTrainingIteration));
  }
};

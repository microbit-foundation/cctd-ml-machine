/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Writable, get } from 'svelte/store';
import { DropdownOption } from '../../components/buttons/Buttons';
import { highlightedAxis } from '../../script/stores/uiStore';
import ModelTrainer from '../../script/domain/ModelTrainer';
import MLModel from '../../script/domain/MLModel';
import Axes from '../../script/domain/Axes';
import { stores } from '../../script/stores/Stores';
import StaticConfiguration from '../../StaticConfiguration';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
import { LossTrainingIteration } from '../../components/graphs/LossGraphUtil';
import { FilterType } from '../../script/domain/FilterTypes';
import Filters from '../../script/domain/Filters';
import ModelRegistry, { ModelInfo } from '../../script/domain/ModelRegistry';

const classifier = stores.getClassifier();

export const options: DropdownOption[] = ModelRegistry.getModels().map(model => {
  return {
    id: model.id,
    label: model.title,
  };
});

export const getModelTrainer = (
  model: ModelInfo,
  onTrainingIteration: (iteration: LossTrainingIteration) => void,
): ModelTrainer<MLModel> => {
  const currentAxis = get(highlightedAxis);
  if (model.id === ModelRegistry.KNN.id) {
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
  const selectedModel = ModelRegistry.getModels().find(
    model => model.id === get(selectedOption).id,
  );
  const model = classifier.getModel();

  if (selectedModel?.id === 'KNN') {
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

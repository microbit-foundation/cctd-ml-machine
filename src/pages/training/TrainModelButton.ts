/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type Writable, get } from 'svelte/store';
import { type DropdownOption } from '../../components/buttons/Buttons';
import { stores } from '../../script/stores/Stores';
import StaticConfiguration from '../../StaticConfiguration';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
import LayersModelTrainer, {
  type LossTrainingIteration,
} from '../../script/mlmodels/LayersModelTrainer';
import { FilterType } from '../../script/domain/FilterTypes';
import Filters from '../../script/domain/Filters';
import ModelRegistry, { type ModelInfo } from '../../script/domain/ModelRegistry';
import { knnConfig } from '../../script/stores/knnConfig';
import type { ModelTrainer } from '../../script/domain/ModelTrainer';
import type { MLModel } from '../../script/domain/MLModel';

const classifier = stores.getClassifier();
const highlightedAxis = stores.getHighlightedAxes();

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
  const currentAxis = get(highlightedAxis)[0];
  if (model.id === ModelRegistry.KNN.id) {
    const offset = currentAxis.index === 0 ? 0 : currentAxis.index === 1 ? 1 : 2; // TODO: Rewrite to use just use the axis as offset directly
    return new KNNNonNormalizedModelTrainer(get(knnConfig).k, data =>
      extractAxisFromTrainingData(data, offset, 3),
    );
  }
  highlightedAxis.set([]);

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

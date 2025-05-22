/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, writable } from 'svelte/store';
import KNNNonNormalizedModelTrainer from '../../lib/mlmodels/KNNNonNormalizedModelTrainer';
import { stores } from '../../lib/stores/Stores';
import { type ModelInfo } from '../../lib/domain/ModelRegistry';
import LayersModelTrainer, {
  type LossTrainingIteration,
} from '../../lib/mlmodels/LayersModelTrainer';
import KNNModelTrainer from '../../lib/mlmodels/KNNModelTrainer';
import type { ModelTrainer } from '../../lib/domain/ModelTrainer';
import type { MLModel } from '../../lib/domain/MLModel';

export const loss = writable<LossTrainingIteration[]>([]);

const trainingIterationHandler = (h: LossTrainingIteration) => {
  loss.update(newLoss => {
    newLoss.push(h);
    return newLoss;
  });
};

export const trainNNModel = async () => {
  loss.set([]); // Reset the loss graph
  const modelTrainer = new LayersModelTrainer(
    get(stores.getNeuralNetworkSettings()),
    trainingIterationHandler,
  );
  await stores.getClassifier().getModel().train(modelTrainer);
};

export const trainKNNModel = async () => {
  const knnSettings = get(stores.getKNNModelSettings());
  const getKNNModelTrainer = (): ModelTrainer<MLModel> => {
    if (knnSettings.normalized) {
      return new KNNModelTrainer(knnSettings.k);
    } else {
      return new KNNNonNormalizedModelTrainer(knnSettings.k);
    }
  };
  stores.getClassifier().getModel().train(getKNNModelTrainer());
};

export const selectModel = async (model: ModelInfo) => {
  stores.getSelectedModel().set(model);
};

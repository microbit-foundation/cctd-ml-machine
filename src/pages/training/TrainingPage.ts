/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, writable } from 'svelte/store';
import { stores } from '../../lib/stores/Stores';
import { type ModelInfo } from '../../core/entities/classifier/models/ModelRegistry';
import type { MLModel } from '../../core/entities/classifier/models/MLModel';
import type { LossTrainingIteration } from '../../core/entities/classifier/models/LayersModelTrainer';
import LayersModelTrainer from '../../core/entities/classifier/models/LayersModelTrainer';
import type { ModelTrainer } from '../../core/entities/classifier/models/ModelTrainer';
import KNNModelTrainer from '../../lib/legacy/KNNModelTrainer';
import KNNNonNormalizedModelTrainer from '../../lib/legacy/KNNNonNormalizedModelTrainer';

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

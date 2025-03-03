/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, writable } from 'svelte/store';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import { stores } from '../../script/stores/Stores';
import CookieManager from '../../script/CookieManager';
import { appInsights } from '../../appInsights';
import ModelRegistry, { type ModelInfo } from '../../script/domain/ModelRegistry';
import LayersModelTrainer, {
  type LossTrainingIteration,
} from '../../script/mlmodels/LayersModelTrainer';
import Logger from '../../script/utils/Logger';
import KNNModelTrainer from '../../script/mlmodels/KNNModelTrainer';
import type { ModelTrainer } from '../../script/domain/ModelTrainer';
import type { MLModel } from '../../script/domain/MLModel';
import { knnCurrentPoint } from '../../components/graphs/knngraph/KnnModelGraph';
import { mode } from 'd3';

export const loss = writable<LossTrainingIteration[]>([]);

const trainingIterationHandler = (h: LossTrainingIteration) => {
  loss.update(newLoss => {
    newLoss.push(h);
    return newLoss;
  });
};

const trainNNModel = async () => {
  loss.set([]); // Reset the loss graph
  const modelTrainer = new LayersModelTrainer(
    get(stores.getNeuralNetworkSettings()),
    trainingIterationHandler,
  );
  await stores.getClassifier().getModel().train(modelTrainer);
};

const trainKNNModel = async () => {
  const knnSettings = get(stores.getKNNModelSettings());
  const getKNNModelTrainer = (): ModelTrainer<MLModel> => {
    if (knnSettings.normalized) {
      return new KNNModelTrainer(knnSettings.k);
    } else {
      return new KNNNonNormalizedModelTrainer(knnSettings.k);
    }
  };
  await stores.getClassifier().getModel().train(getKNNModelTrainer());
};

export const trainModel = async (model: ModelInfo) => {
  Logger.log('TrainingPage', 'Training new model: ' + model.title);
  // highlightedAxis.set(undefined);
  if (ModelRegistry.KNN.id === model.id) {
    await trainKNNModel();
  } else if (ModelRegistry.NeuralNetwork.id === model.id) {
    await trainNNModel();
  }
  trackModelEvent();
};

const trackModelEvent = () => {
  if (CookieManager.getComplianceChoices().analytics) {
    appInsights.trackEvent({
      name: 'ModelTrained',
      properties: {
        modelType: get(stores.getSelectedModel()).id,
      },
    });
  }
};

export const selectModel = async (model: ModelInfo) => {
  if (model.id === ModelRegistry.KNN.id) {
    await trainKNNModel()
  }
  stores.getSelectedModel().set(model);
};

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

export const loss = writable<LossTrainingIteration[]>([]);

const trainingIterationHandler = (h: LossTrainingIteration) => {
  loss.update(newLoss => {
    newLoss.push(h);
    return newLoss;
  });
};

const trainNNModel = async () => {
  //stores.getHighlightedAxes().set(get(stores.getAvailableAxes()));
  loss.set([]);
  const modelTrainer = new LayersModelTrainer(
    get(stores.getNeuralNetworkSettings()),
    trainingIterationHandler,
  );
  await stores.getClassifier().getModel().train(modelTrainer);
};

const trainKNNModel = async () => {
  const modelTrainer = new KNNNonNormalizedModelTrainer(
    get(stores.getKNNModelSettings()).k,
  );
  await stores.getClassifier().getModel().train(modelTrainer);
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

export const selectModel = (model: ModelInfo) => {
  stores.getSelectedModel().set(model);
};

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, writable } from 'svelte/store';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import StaticConfiguration from '../../StaticConfiguration';
import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
import { stores } from '../../script/stores/Stores';
import CookieManager from '../../script/CookieManager';
import { appInsights } from '../../appInsights';
import ModelRegistry, { type ModelInfo } from '../../script/domain/ModelRegistry';
import LayersModelTrainer, {
  type LossTrainingIteration,
} from '../../script/mlmodels/LayersModelTrainer';
import { knnConfig } from '../../script/stores/knnConfig';
import Logger from '../../script/utils/Logger';

export const loss = writable<LossTrainingIteration[]>([]);

const trainingIterationHandler = (h: LossTrainingIteration) => {
  loss.update(newLoss => {
    newLoss.push(h);
    return newLoss;
  });
};

const trainNNModel = async () => {
  stores.getHighlightedAxes().set(get(stores.getAvailableAxes()));
  loss.set([]);
  const modelTrainer = new LayersModelTrainer(
    StaticConfiguration.layersModelTrainingSettings,
    trainingIterationHandler,
  );
  await stores.getClassifier().getModel().train(modelTrainer);
};

const trainKNNModel = async () => {
  // If not exactly 1 axis is highlighted, then set that to be highlighted, fix it later
  if (get(stores.getHighlightedAxes()).length !== 1) {
    stores.getHighlightedAxes().set([get(stores.getAvailableAxes())[0]]);
  }
  const currentAxis = get(stores.getHighlightedAxes())[0];
  // TODO: Rewrite offset to use the axis directly instead
  const offset = currentAxis.index === 0 ? 0 : currentAxis.index === 1 ? 1 : 2;
  const modelTrainer = new KNNNonNormalizedModelTrainer(
    get(knnConfig).k,
    data => {
      const extractedData = extractAxisFromTrainingData(data, offset, 3);
      Logger.log('TrainingPage', 'Extracted data: \n' + JSON.stringify(extractedData));
      return extractedData;
    }, // 3 assumes 3 axis
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

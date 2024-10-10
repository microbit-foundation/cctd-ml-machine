/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, writable } from 'svelte/store';
import { highlightedAxis, selectedModel } from '../../script/stores/uiStore';
import Axes from '../../script/domain/Axes';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import StaticConfiguration from '../../StaticConfiguration';
import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
import { stores } from '../../script/stores/Stores';
import CookieManager from '../../script/CookieManager';
import { appInsights } from '../../appInsights';
import ModelRegistry, { ModelInfo } from '../../script/domain/ModelRegistry';
import LayersModelTrainer, {
  LossTrainingIteration,
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
  highlightedAxis.set(undefined);
  loss.set([]);
  const modelTrainer = new LayersModelTrainer(
    StaticConfiguration.layersModelTrainingSettings,
    trainingIterationHandler,
  );
  await stores.getClassifier().getModel().train(modelTrainer);
};

const trainKNNModel = async () => {
  if (get(highlightedAxis) === undefined) {
    highlightedAxis.set(Axes.X);
  }
  const currentAxis = get(highlightedAxis);
  const offset = currentAxis === Axes.X ? 0 : currentAxis === Axes.Y ? 1 : 2;
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
        modelType: get(selectedModel).id,
      },
    });
  }
};

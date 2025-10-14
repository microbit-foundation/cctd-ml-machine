/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, writable } from 'svelte/store';
import { stores } from '../../lib/stores/Stores';
import type { ModelInfo } from '../../core/model/ModelRegistry';
import { NeuralNetworkModelTrainer } from '../../core/model/neural-network/NeuralNetworkModelTrainer';
import { NeuralNetworkSettingsImpl } from '../../core/model/neural-network/NeuralNetworkSettingsImpl';
import StaticConfiguration from '../../StaticConfiguration';
import type { NeuralNetworkArchitecture } from '../../core/model/neural-network/NeuralNetworkArchitecture';
import { BasicNeuralNetworkArchitecture } from '../../core/model/neural-network/BasicNeuralNetworkArchitecture';
import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';
import type { ModelTrainer } from '../../core/model/ModelTrainer';
import type KNNMLModel from '../../core/model/KNN/KNNMLModel';
import KNNModelTrainer from '../../core/model/KNN/KNNModelTrainer';

export const loss = writable<NeuralNetworkTrainingIteration[]>([]);

const trainingIterationHandler = (h: NeuralNetworkTrainingIteration) => {
  loss.update(newLoss => {
    newLoss.push(h);
    return newLoss;
  });
};

export const trainNNModel = async () => {
  loss.set([]); // Reset the loss graph
  const architecture: NeuralNetworkArchitecture = new BasicNeuralNetworkArchitecture(
    stores.getGestures().getNumberOfGestures(),
    stores.getClassifier().getFilters().count(),
    16
  );
  const modelTrainer = new NeuralNetworkModelTrainer(
    new NeuralNetworkSettingsImpl(StaticConfiguration.defaultNeuralNetworkSettings, architecture, {
      handleTrainingIteration: trainingIterationHandler
    })
  );

  await stores.getClassifier().getModel().train(modelTrainer);
};

export const trainKNNModel = async () => {
  const knnSettings = get(stores.getKNNModelSettings());
  const getKNNModelTrainer = (): ModelTrainer<KNNMLModel, {}> => {
    return new KNNModelTrainer({ k: knnSettings.k, normalize: knnSettings.normalized, numberOfClasses: stores.getGestures().getNumberOfGestures() })
  };
  stores.getClassifier().getModel().train(getKNNModelTrainer());
};

export const selectModel = async (model: ModelInfo) => {
  stores.getSelectedModel().set(model);
};

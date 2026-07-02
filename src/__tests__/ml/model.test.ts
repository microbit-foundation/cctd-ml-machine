/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import TestTrainingDataRepository from '../mocks/TestTrainingDataRepository';
import StaticConfiguration from '../../StaticConfiguration';
import BaseVector from '../../core/vector/BaseVector';
import { NeuralNetworkModelTrainer } from '../../core/model/neural-network/NeuralNetworkModelTrainer';
import KNNModelTrainer from '../../core/model/KNN/KNNModelTrainer';
import { NeuralNetworkSettingsImpl } from '../../core/model/neural-network/NeuralNetworkSettingsImpl';

describe('ML Model tests', async () => {
  describe('Layers Model', async () => {
    test('Model should train the expected number of times', async () => {
      let iterations = 0;
      const trainingData = new TestTrainingDataRepository();
      const trainer = new NeuralNetworkModelTrainer(
        new NeuralNetworkSettingsImpl(StaticConfiguration.defaultNeuralNetworkSettings),
      );
      const model = trainer.trainModel(trainingData);
      expect(iterations).toBe(
        StaticConfiguration.defaultNeuralNetworkSettings.noOfEpochs,
      );
    });
  });
  describe('KNN-non normalized Model', async () => {
    test('Model should train the expected number of times', async () => {
      const trainingData = new TestTrainingDataRepository();
      const knnModel = await new KNNModelTrainer({
        k: 2,
        normalize: false,
        numberOfClasses: 3
      }).trainModel(trainingData);
      const prediction1 = await knnModel.predict(
        new BaseVector([0, 0, 0, 0, 0, 0, 0, 0, 0]),
      );
      expect(prediction1.getValue()).toStrictEqual([0, 1, 0]);
      const prediction2 = await knnModel.predict(
        new BaseVector([1, 1, 0, 0, 0, -2, 0, -3, 0]),
      );
      expect(prediction2.getValue()).toStrictEqual([0.5, 0, 0.5]);
    });
  });
});

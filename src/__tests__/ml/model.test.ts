/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import TestTrainingDataRepository from '../mocks/TestTrainingDataRepository';
import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
import StaticConfiguration from '../../StaticConfiguration';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import BaseVector from '../../script/domain/BaseVector';

describe('ML Model tests', async () => {
  describe('Layers Model', async () => {
    test('Model should train the expected number of times', async () => {
      let iterations = 0;

      const trainingData = new TestTrainingDataRepository();
      await new LayersModelTrainer(
        StaticConfiguration.defaultNeuralNetworkSettings,
        () => (iterations += 1),
      ).trainModel(trainingData);

      expect(iterations).toBe(
        StaticConfiguration.defaultNeuralNetworkSettings.noOfEpochs,
      );
    });
  });
  describe('KNN-non normalized Model', async () => {
    test('Model should train the expected number of times', async () => {
      const trainingData = new TestTrainingDataRepository();
      const knnModel = await new KNNNonNormalizedModelTrainer(2).trainModel(trainingData);

      const prediction1 = await knnModel.predict(new BaseVector([0, 0, 0, 0, 0, 0, 0, 0, 0]));
      expect(prediction1).toStrictEqual([0, 1, 0]);
      const prediction2 = await knnModel.predict(new BaseVector([1, 1, 0, 0, 0, -2, 0, -3, 0]));
      expect(prediction2).toStrictEqual([0.5, 0, 0.5]);
    });
  });
});

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
import KNNModelTrainer from '../../script/mlmodels/KNNModelTrainer';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';

describe('ML Model tests', async () => {
    describe("Layers Model", async () => {
        test('Model should train the expected number of times', async () => {
            let iterations = 0;

            const trainingData = new TestTrainingDataRepository().getTrainingData();
            await new LayersModelTrainer(
                StaticConfiguration.defaultNeuralNetworkSettings,
                () => (iterations += 1),
            ).trainModel(trainingData);

            expect(iterations).toBe(StaticConfiguration.defaultNeuralNetworkSettings.noOfEpochs);
        });


    })
    describe("KNN-non normalized Model", async () => {
        test('Model should train the expected number of times', async () => {
            let iterations = 0;

            const trainingData = new TestTrainingDataRepository().getTrainingData();
            const knnModel = await new KNNNonNormalizedModelTrainer(2).trainModel(trainingData);

            expect(async () => await knnModel.predict([0, 0, 0, 0, 0, 0, 0, 0, 0])).not.throws()
        });
    });
});

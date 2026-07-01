/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { TrainingResult } from '../../classifier/TrainingResult';
import type { Dataset } from '../../dataset/Dataset';
import ModelRegistry from '../ModelRegistry';
import type { ModelTrainer, ModelTrainerResult } from '../ModelTrainer';
import { NeuralNetworkLayersModelFactory } from './NeuralNetworkLayersFactory';
import { NeuralNetworkModel } from './NeuralNetworkModel';
import type { NeuralNetworkModelSettings } from './NeuralNetworkLearningSettings';
import * as tf from '@tensorflow/tfjs';
import type { ModelInfo } from '../ModelInfo';

export class NeuralNetworkModelTrainer
  implements ModelTrainer<NeuralNetworkModel, TrainingResult>
{
  constructor(private settings: NeuralNetworkModelSettings) {}

  public getModelInfo(): ModelInfo {
    return ModelRegistry.NeuralNetwork;
  }

  public async trainModel(
    dataset: Dataset,
  ): Promise<ModelTrainerResult<NeuralNetworkModel, TrainingResult>> {
    if (!dataset.isValid()) {
      throw new Error('Dataset chosen to train with is invalid!');
    }

    // Fetch data
    const features: Array<number[]> = dataset
      .getFeatureSet()
      .map(features => features.getFeatures().getValue());
    const labels: Array<number[]> = dataset
      .getLabels()
      .getLabelVectors()
      .map(labelVector => labelVector.getValue());
    console.log('Training features:', features);
    console.log('Training labels:', labels);
    const tensorFeatures = tf.tensor(features);
    const tensorLabels = tf.tensor(labels);
    const modelFactory = new NeuralNetworkLayersModelFactory();
    console.log(
      'Building model with settings:',
      this.settings.getArchitecture(),
      this.settings.getLearningSettings(),
    );
    const model = modelFactory.buildLayers(this.settings.getArchitecture());

    model.compile({
      loss: 'categoricalCrossentropy',
      optimizer: tf.train.sgd(this.settings.getLearningSettings().getLearningRate()),
      metrics: ['accuracy'],
    });

    for (let i = 0; i < this.settings.getLearningSettings().getNumberOfEpochs(); i++) {
      try {
        const iteration = await model.fit(tensorFeatures, tensorLabels, {
          epochs: 1,
          batchSize: this.settings.getLearningSettings().getBatchSize(),
          validationSplit: this.settings.getLearningSettings().getValidationSplit(),
        });
        this.settings.getTrainingObserver().handleTrainingIteration({
          epoch: i,
          loss: iteration.history.loss[0] as number,
        });
      } catch (error) {
        console.error('tensorflow training process failed:', error);
        return Promise.reject(error);
      }
    }
    return Promise.resolve({
      model: new NeuralNetworkModel(model),
      trainingInformation: {},
    });
  }
}

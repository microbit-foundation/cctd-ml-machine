/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import LayersMLModel from './LayersMLModel';
import * as tf from '@tensorflow/tfjs';
import type { ModelTrainer } from './ModelTrainer';
import type { ModelInfo } from './ModelRegistry';
import ModelRegistry from './ModelRegistry';
import type { TrainingDataRepository } from '../../../repository/TrainingDataRepository';
import type { NeuralNetworkModelSettings } from '../../../model/neural-network/NeuralNetworkModelSettings';
export type LayersModelTrainingSettings = {
  noOfEpochs: number;
  noOfUnits: number;
  validationSplit: number;
  learningRate: number;
  batchSize: number;
};

export type LossTrainingIteration = {
  loss: number;
  epoch: number;
};

class LayersModelTrainer implements ModelTrainer<LayersMLModel> {
  constructor(
    private settings: NeuralNetworkModelSettings,
    private onFitIteration: (h: LossTrainingIteration) => void,
  ) {}

  public getModelInfo(): ModelInfo {
    return ModelRegistry.NeuralNetwork;
  }

  public async trainModel(
    trainingDataRepository: TrainingDataRepository,
  ): Promise<LayersMLModel> {
    const trainingData = trainingDataRepository.getTrainingData();
    // Fetch data
    const features: Array<number[]> = [];
    const labels: Array<number[]> = [];
    const numberOfClasses = trainingData.classes.length;

    trainingData.classes.forEach((gestureClass, index) => {
      gestureClass.samples.forEach(sample => {
        features.push(sample.value.getValue());

        const label: number[] = new Array(numberOfClasses) as number[];
        label.fill(0, 0, numberOfClasses);
        label[index] = 1;
        labels.push(label);
      });
    });

    const tensorFeatures = tf.tensor(features);
    const tensorLabels = tf.tensor(labels);

    // Find the shape by looking at the first data point
    const inputShape = [trainingData.classes[0].samples[0].value.getSize()];

    const input = tf.input({ shape: inputShape });
    const normalizer = tf.layers.batchNormalization().apply(input);
    const dense = tf.layers
      .dense({ units: this.settings.getArchitecture().getHiddenLayers()[0].getNumberOfNodes(), activation: 'relu' })
      .apply(normalizer);
    const softmax = tf.layers
      .dense({ units: numberOfClasses, activation: 'softmax' })
      .apply(dense) as tf.SymbolicTensor;

    const model = tf.model({ inputs: input, outputs: softmax });

    model.compile({
      loss: 'categoricalCrossentropy',
      optimizer: tf.train.sgd(this.settings.getLearningRate()),
      metrics: ['accuracy'],
    });

    for (let i = 0; i < this.settings.getNumberOfEpochs(); i++) {
      const h = await model
        .fit(tensorFeatures, tensorLabels, {
          epochs: 1,
          batchSize: this.settings.getBatchSize(),
          validationSplit: this.settings.getValidationSplit(),
        })
        .catch(err => {
          console.error('tensorflow training process failed:', err);
          return Promise.reject(err);
        });
      this.onFitIteration({
        epoch: i,
        loss: h.history.loss[0] as number,
      });
    }
    return Promise.resolve(new LayersMLModel(model));
  }
}

export default LayersModelTrainer;

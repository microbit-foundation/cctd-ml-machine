/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Dataset } from "../../dataset/Dataset";
import type { ModelInfo } from "../ModelRegistry";
import ModelRegistry from "../ModelRegistry";
import type { ModelTrainer } from "../ModelTrainer";
import type { NeuralNetworkModel } from "./NeuralNetworkModel";
import type { NeuralNetworkModelSettings } from "./NeuralNetworkModelSettings";
import * as tf from '@tensorflow/tfjs';

export type LossTrainingIteration = {
  loss: number;
  epoch: number;
};

export class NeuralNetworkModelTrainer implements ModelTrainer<NeuralNetworkModel> {
  constructor(
    private settings: NeuralNetworkModelSettings,
    private onFitIteration: (h: LossTrainingIteration) => void,
  ) {}

  public getModelInfo(): ModelInfo {
    return ModelRegistry.NeuralNetwork;
  }

  public async trainModel(dataset: Dataset): Promise<NeuralNetworkModel> {
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
    const tensorFeatures = tf.tensor(features);
    const tensorLabels = tf.tensor(labels);

    const numberOfClasses = dataset.getNumberOfClasses();

    // Find the shape by looking at the first data point
    const inputShape = [dataset.getFeatureSize()];

    const input = tf.input({ shape: inputShape });
    const normalizer = tf.layers.batchNormalization().apply(input);
    const dense = tf.layers
      .dense({ units: this.settings.noOfUnits, activation: 'relu' })
      .apply(normalizer);
    const softmax = tf.layers
      .dense({ units: numberOfClasses, activation: 'softmax' })
      .apply(dense) as tf.SymbolicTensor;

    const model = tf.model({ inputs: input, outputs: softmax });

    model.compile({
      loss: 'categoricalCrossentropy',
      optimizer: tf.train.sgd(this.settings.learningRate),
      metrics: ['accuracy'],
    });

    for (let i = 0; i < this.settings.noOfEpochs; i++) {
      const h = await model
        .fit(tensorFeatures, tensorLabels, {
          epochs: 1,
          batchSize: this.settings.batchSize,
          validationSplit: this.settings.validationSplit,
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


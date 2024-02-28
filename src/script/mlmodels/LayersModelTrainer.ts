/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { LossTrainingIteration } from '../../components/graphs/LossGraphUtil';
import ModelTrainer, { TrainingData } from '../domain/ModelTrainer';
import LayersMLModel from './LayersMLModel';
import * as tf from '@tensorflow/tfjs';
export type LayersModelTrainingSettings = {
  noOfEpochs: number;
  noOfUnits: number;
  validationSplit: number;
  learningRate: number;
  batchSize: number;
};

class LayersModelTrainer implements ModelTrainer<LayersMLModel> {
  constructor(
    private settings: LayersModelTrainingSettings,
    private onFitIteration: (h: LossTrainingIteration) => void,
  ) {}
  public async trainModel(trainingData: TrainingData): Promise<LayersMLModel> {
    // Fetch data
    const features: Array<number[]> = [];
    const labels: Array<number[]> = [];
    const numberOfClasses = trainingData.classes.length;

    trainingData.classes.forEach((gestureClass, index) => {
      gestureClass.samples.forEach(sample => {
        features.push(sample.value);

        const label: number[] = new Array(numberOfClasses) as number[];
        label.fill(0, 0, numberOfClasses);
        label[index] = 1;
        labels.push(label);
      });
    });

    const tensorFeatures = tf.tensor(features);
    const tensorLabels = tf.tensor(labels);

    // Find the shape by looking at the first data point
    const inputShape = [trainingData.classes[0].samples[0].value.length];

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

export default LayersModelTrainer;

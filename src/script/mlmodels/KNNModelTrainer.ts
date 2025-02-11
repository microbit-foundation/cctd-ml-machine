/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import KNNMLModel from './KNNMLModel';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import type { ModelTrainer, TrainingData } from '../domain/ModelTrainer';

/**
 * Trains a K-Nearest Neighbour model
 */
class KNNModelTrainer implements ModelTrainer<KNNMLModel> {
  constructor(
    private k: number,
  ) {}
  public trainModel(trainingData: TrainingData): Promise<KNNMLModel> {
    const knn: knnClassifier.KNNClassifier = knnClassifier.create();

    trainingData.classes.forEach((gestureClass, index) => {
      gestureClass.samples.forEach(sample => {
        const example: tf.Tensor = tf.tensor(sample.value);
        knn.addExample(example, index);
      });
    });

    return Promise.resolve(new KNNMLModel(knn, this.k));
  }
}

export default KNNModelTrainer;

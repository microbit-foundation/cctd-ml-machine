/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ModelTrainer, { TrainingData } from '../domain/ModelTrainer';
import KNNMLModel from './KNNMLModel';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

/**
 * Trains a K-Nearest Neighbour model
 */
class KNNModelTrainer implements ModelTrainer<KNNMLModel> {
  // TODO: dataFilterer is mostly for the highlighted axis use-case, should it be more generic, or stay here?
  constructor(
    private k: number,
    private dataFilterer?: (allData: TrainingData) => TrainingData,
  ) {}
  public trainModel(trainingData: TrainingData): Promise<KNNMLModel> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const knn: knnClassifier.KNNClassifier = knnClassifier.create();

    if (this.dataFilterer) {
      trainingData = this.dataFilterer(trainingData);
    }

    console.log(trainingData);
    trainingData.classes.forEach((gestureClass, index) => {
      gestureClass.samples.forEach(sample => {
        const example: tf.Tensor = tf.tensor(sample.value);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        knn.addExample(example, index);
      });
    });

    return Promise.resolve(new KNNMLModel(knn, this.k));
  }
}

export default KNNModelTrainer;

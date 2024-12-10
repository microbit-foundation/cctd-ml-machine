/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type BaseVector from '../domain/BaseVector';
import type { ModelTrainer, TrainingData } from '../domain/ModelTrainer';
import Logger from '../utils/Logger';
import type { LabelledPoint } from './KNNNonNormalizedMLModel';
import KNNNonNormalizedMLModel from './KNNNonNormalizedMLModel';

/**
 * Trains a K-Nearest Neighbour model. Unlike the version provided by tensorflow, the points are not normalized
 */
class KNNNonNormalizedModelTrainer implements ModelTrainer<KNNNonNormalizedMLModel> {
  // TODO: dataFilterer is mostly for the highlighted axis use-case, should it be more generic, or stay here?
  constructor(
    private k: number,
  ) {}

  public trainModel(trainingData: TrainingData): Promise<KNNNonNormalizedMLModel> {
    Logger.log('KNNNonNormalizedModelTrainer', 'Training KNN model');
    const points: LabelledPoint[] = [];

    trainingData.classes.forEach((gestureClass, labelIndex) => {
      gestureClass.samples.forEach(sample => {
        points.push({
          classIndex: labelIndex,
          vector: sample.value
        });
      });
    });

    return Promise.resolve(
      new KNNNonNormalizedMLModel(this.k, trainingData.classes.length, points),
    );
  }
}

export default KNNNonNormalizedModelTrainer;

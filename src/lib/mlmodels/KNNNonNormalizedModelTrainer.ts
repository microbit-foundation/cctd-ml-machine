/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { knnTrainingDataPoints } from '../../components/graphs/knngraph/KnnModelGraph';
import type { ModelTrainer } from '../domain/ModelTrainer';
import type { TrainingDataRepository } from '../domain/TrainingDataRepository';
import Logger from '../utils/Logger';
import type { LabelledPoint } from './KNNNonNormalizedMLModel';
import KNNNonNormalizedMLModel from './KNNNonNormalizedMLModel';

/**
 * Trains a K-Nearest Neighbour model. Unlike the version provided by tensorflow, the points are not normalized
 */
class KNNNonNormalizedModelTrainer implements ModelTrainer<KNNNonNormalizedMLModel> {
  constructor(private k: number) {}

  public trainModel(
    trainingDataRepository: TrainingDataRepository,
  ): Promise<KNNNonNormalizedMLModel> {
    Logger.log('KNNNonNormalizedModelTrainer', 'Training KNN model');
    const trainingData = trainingDataRepository.getTrainingData();
    const points: LabelledPoint[] = [];

    trainingData.classes.forEach((gestureClass, labelIndex) => {
      gestureClass.samples.forEach(sample => {
        points.push({
          classIndex: labelIndex,
          vector: sample.value,
        });
      });
    });

    knnTrainingDataPoints.set(points);

    return Promise.resolve(
      new KNNNonNormalizedMLModel(this.k, trainingData.classes.length, points),
    );
  }
}

export default KNNNonNormalizedModelTrainer;

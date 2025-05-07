/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import KNNMLModel from './KNNMLModel';
import type { ModelTrainer } from '../domain/ModelTrainer';
import type { TrainingDataRepository } from '../domain/TrainingDataRepository';
import type { LabelledPoint } from './KNNNonNormalizedMLModel';
import { knnTrainingDataPoints } from '../../components/features/graphs/knngraph/KnnModelGraph';

/**
 * Trains a K-Nearest Neighbour model
 */
class KNNModelTrainer implements ModelTrainer<KNNMLModel> {
  constructor(private k: number) {}
  public trainModel(trainingDataRepository: TrainingDataRepository): Promise<KNNMLModel> {
    const trainingData = trainingDataRepository.getTrainingData();
    const mean = trainingDataRepository.getTrainingDataMean();
    const stdDev = trainingDataRepository.getTrainingDataStdDeviation();

    const points: LabelledPoint[] = [];

    trainingData.classes.forEach((gestureClass, labelIndex) => {
      gestureClass.samples.forEach(sample => {
        points.push({
          classIndex: labelIndex,
          vector: KNNMLModel.normalizePoint(sample.value, mean, stdDev),
        });
      });
    });

    knnTrainingDataPoints.set(points);

    return Promise.resolve(
      new KNNMLModel(this.k, trainingData.classes.length, points, mean, stdDev),
    );
  }
}

export default KNNModelTrainer;

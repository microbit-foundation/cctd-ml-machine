/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { knnTrainingDataPoints } from '../../../../lib/stores/KNNStores';
import type { TrainingDataRepository } from '../../../repository/TrainingDataRepository';
import KNNMLModel from './KNNMLModel';
import type { LabelledPoint } from './KNNNonNormalizedMLModel';
import type { ModelInfo } from './ModelRegistry';
import ModelRegistry from './ModelRegistry';
import type { ModelTrainer } from './ModelTrainer';

/**
 * Trains a K-Nearest Neighbour model
 */
class KNNModelTrainer implements ModelTrainer<KNNMLModel> {
  constructor(private k: number) {}

  public getModelInfo(): ModelInfo {
    return ModelRegistry.KNN;
  }

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

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { knnGraphPointsStore } from '../../components/graphs/knngraph/KnnModelGraph';
import type { ModelTrainer, TrainingData } from '../domain/ModelTrainer';
import Vector from '../domain/Vector';
import { stores } from '../stores/Stores';
import Logger from '../utils/Logger';
import type { LabelledPoint } from './KNNNonNormalizedMLModel';
import KNNNonNormalizedMLModel from './KNNNonNormalizedMLModel';

/**
 * Trains a K-Nearest Neighbour model. Unlike the version provided by tensorflow, the points are not normalized
 */
class KNNNonNormalizedModelTrainer implements ModelTrainer<KNNNonNormalizedMLModel> {
  constructor(private k: number) { }

  public trainModel(trainingData: TrainingData): Promise<KNNNonNormalizedMLModel> {
    Logger.log('KNNNonNormalizedModelTrainer', 'Training KNN model');
    const points: LabelledPoint[] = [];

    trainingData.classes.forEach((gestureClass, labelIndex) => {
      gestureClass.samples.forEach(sample => {
        points.push({
          classIndex: labelIndex,
          vector: new Vector(sample.value),
        });
      });
    });

    knnGraphPointsStore.update(s => {
      s.trainingPoints = points.map(e => e.vector);
      return s;
    });

    return Promise.resolve(
      new KNNNonNormalizedMLModel(this.k, trainingData.classes.length, points),
    );
  }
}

export default KNNNonNormalizedModelTrainer;

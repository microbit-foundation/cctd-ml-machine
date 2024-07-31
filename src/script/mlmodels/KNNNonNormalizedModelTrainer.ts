/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ModelTrainer, { TrainingData } from '../domain/ModelTrainer';
import Logger from '../utils/Logger';
import KNNNonNormalizedMLModel, { LabelledPoint } from './KNNNonNormalizedMLModel';

/**
 * Trains a K-Nearest Neighbour model. Unlike the version provided by tensorflow, the points are not normalized
 */
class KNNNonNormalizedModelTrainer implements ModelTrainer<KNNNonNormalizedMLModel> {
  // TODO: dataFilterer is mostly for the highlighted axis use-case, should it be more generic, or stay here?
  constructor(
    private k: number,
    private dataFilterer?: (allData: TrainingData) => TrainingData,
  ) { }

  public trainModel(trainingData: TrainingData): Promise<KNNNonNormalizedMLModel> {
    Logger.log('KNNNonNormalizedModelTrainer', 'Training model');
    if (this.dataFilterer) {
      Logger.log('KNNNonNormalizedModelTrainer', 'Filtering training data');
      trainingData = this.dataFilterer(trainingData);
    } else {
      Logger.log('KNNNonNormalizedModelTrainer', 'No data filtering');
    }
    const points: LabelledPoint[] = [];

    trainingData.classes.forEach((gestureClass, labelIndex) => {
      gestureClass.samples.forEach(sample => {
        points.push({
          classIndex: labelIndex,
          x: sample.value[0],
          y: sample.value[1],
          z: sample.value.length > 2 ? sample.value[2] : 0,
        });
      });
    });

    return Promise.resolve(
      new KNNNonNormalizedMLModel(this.k, trainingData.classes.length, points),
    );
  }
}

export default KNNNonNormalizedModelTrainer;

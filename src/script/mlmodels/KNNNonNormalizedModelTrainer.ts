/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ModelTrainer, { TrainingData } from '../domain/ModelTrainer';
import KNNNonNormalizedMLModel, { LabelledPoint } from './KNNNonNormalizedMLModel';

/**
 * Trains a K-Nearest Neighbour model. Unlike the version provided by tensorflow, the points are not normalized
 */
class KNNNonNormalizedModelTrainer implements ModelTrainer<KNNNonNormalizedMLModel> {
  // TODO: dataFilterer is mostly for the highlighted axis use-case, should it be more generic, or stay here?
  constructor(
    private k: number,
    private dataFilterer?: (allData: TrainingData) => TrainingData,
  ) {}

  public trainModel(trainingData: TrainingData): Promise<KNNNonNormalizedMLModel> {
    if (this.dataFilterer) {
      trainingData = this.dataFilterer(trainingData);
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

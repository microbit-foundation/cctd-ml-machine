/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { knnTrainingDataPoints } from "../../../../lib/stores/KNNStores";
import Logger from "../../../../lib/utils/Logger";
import type { TrainingDataRepository } from "../../../repository/TrainingDataRepository";
import type { LabelledPoint } from "./KNNNonNormalizedMLModel";
import KNNNonNormalizedMLModel from "./KNNNonNormalizedMLModel";
import type { ModelInfo } from "./ModelRegistry";
import ModelRegistry from "./ModelRegistry";
import type { ModelTrainer } from "./ModelTrainer";


/**
 * Trains a K-Nearest Neighbour model. Unlike the version provided by tensorflow, the points are not normalized
 */
class KNNNonNormalizedModelTrainer implements ModelTrainer<KNNNonNormalizedMLModel> {
  constructor(private k: number) {}

  public getModelInfo(): ModelInfo {
    return ModelRegistry.KNN;
  }

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

/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';
import type { MLModel } from './MLModel';
import type { Dataset } from '../dataset/Dataset';
import type { TrainingResult } from '../classifier/TrainingResult';
import type { ModelInfo } from './ModelInfo';

export type TrainingData = {
  classes: {
    samples: {
      value: Vector;
    }[];
  }[];
};

export interface ModelTrainerResult<T extends MLModel, U extends TrainingResult> {
  model: T;
  trainingInformation: U;
}

export interface ModelTrainer<T extends MLModel, U extends TrainingResult> {
  getModelInfo(): ModelInfo;
  trainModel(dataset: Dataset): Promise<ModelTrainerResult<T, U>>;
}

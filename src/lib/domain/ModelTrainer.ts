/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MLModel } from './MLModel';
import type { ModelInfo } from './ModelRegistry';
import type { TrainingDataRepository } from './TrainingDataRepository';
import type { Vector } from './Vector';

export type TrainingData = {
  classes: {
    samples: {
      value: Vector;
    }[];
  }[];
};

export interface ModelTrainer<T extends MLModel> {
  getModelInfo(): ModelInfo;
  trainModel(trainingDataRepository: TrainingDataRepository): Promise<T>;
}

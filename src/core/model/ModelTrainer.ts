/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';
import type { MLModel } from './MLModel';
import type { ModelInfo } from './ModelRegistry';
import type { Dataset } from '../dataset/Dataset';

export type TrainingData = {
  classes: {
    samples: {
      value: Vector;
    }[];
  }[];
};

export interface ModelTrainer<T extends MLModel> {
  getModelInfo(): ModelInfo;
  trainModel(dataset: Dataset): Promise<T>;
}

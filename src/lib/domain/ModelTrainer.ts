/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MLModel } from './MLModel';
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
  trainModel(trainingDataRepository: TrainingDataRepository): Promise<T>;
}

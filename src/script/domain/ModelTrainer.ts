/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MLModel } from './MLModel';

export type TrainingData = {
  classes: {
    samples: {
      value: number[];
    }[];
  }[];
};

export interface ModelTrainer<T extends MLModel> {
  trainModel(trainingData: TrainingData): Promise<T>;
}

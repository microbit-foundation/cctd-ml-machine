/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { type TrainingData } from './ModelTrainer';

export interface TrainingDataRepository {
  getTrainingData(): TrainingData;
}

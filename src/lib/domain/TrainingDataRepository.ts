/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { type TrainingData } from './ModelTrainer';
import type { Vector } from './Vector';

export interface TrainingDataRepository {
  getTrainingData(): TrainingData;
  getTrainingDataMean(): Vector;
  getTrainingDataStdDeviation(): Vector;
}

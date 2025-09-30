/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';
import type { TrainingData } from '../model/ModelTrainer';

export interface TrainingDataRepository {
  getTrainingData(): TrainingData;
  getTrainingDataMean(): Vector;
  getTrainingDataStdDeviation(): Vector;
}

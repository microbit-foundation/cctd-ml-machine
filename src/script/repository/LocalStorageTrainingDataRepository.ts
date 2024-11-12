/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { type TrainingData } from '../domain/ModelTrainer';
import type { TrainingDataRepository } from '../domain/TrainingDataRepository';

class LocalStorageTrainingDataRepository implements TrainingDataRepository {
  getTrainingData(): TrainingData {
    throw new Error('Method not implemented.');
  }
}

export default LocalStorageTrainingDataRepository;

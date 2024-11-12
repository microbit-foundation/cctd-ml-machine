/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { ClassifierRepository } from './ClassifierRepository';
import type { GestureRepository } from './GestureRepository';
import type { TrainingDataRepository } from './TrainingDataRepository';

export interface Repositories {
  getGestureRepository(): GestureRepository;

  getClassifierRepository(): ClassifierRepository;

  getTrainingDataRepository(): TrainingDataRepository;
}

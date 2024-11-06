/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ClassifierRepository from './ClassifierRepository';
import GestureRepository from './GestureRepository';
import TrainingDataRepository from './TrainingDataRepository';

interface Repositories {
  getGestureRepository(): GestureRepository;

  getClassifierRepository(): ClassifierRepository;

  getTrainingDataRepository(): TrainingDataRepository;
}

export default Repositories;

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ClassifierRepository from './ClassifierRepository';
import GestureRepository from './GestureRepository';
import Confidences from './stores/Confidences';

interface Repositories {
  getGestureRepository(): GestureRepository;

  getClassifierRepository(): ClassifierRepository;
}

export default Repositories;

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Writable } from 'svelte/store';
import ClassifierRepository from './ClassifierRepository';
import GestureRepository from './GestureRepository';
import { GestureID } from './stores/gesture/Gesture';

interface Repositories {
  getGestureRepository(): GestureRepository;

  getClassifierRepository(): ClassifierRepository;
}

export default Repositories;

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Writable } from 'svelte/store';
import Classifier from './stores/Classifier';
import Confidences from './stores/Confidences';
import GestureConfidence from './stores/gesture/GestureConfidence';
import type { Filter } from './Filter';

export interface ClassifierRepository {
  getClassifier(): Classifier;

  getGestureConfidence(gestureId: number): GestureConfidence;

  getConfidences(): Confidences;

  getFilters(): Writable<Filter[]>;
}

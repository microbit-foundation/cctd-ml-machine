/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Classifier } from '../../core/classifier/Classifier';

export interface ClassifierRepository {
  getClassifier(): Classifier | undefined;
  setClassifier(classifier: Classifier | undefined): void;
}

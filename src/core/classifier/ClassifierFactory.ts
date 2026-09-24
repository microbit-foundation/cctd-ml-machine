/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from './Classifier';
import type { MLModel } from '../model/MLModel';

export interface ClassifierFactory {
  createClassifier(model: MLModel): Classifier;
}

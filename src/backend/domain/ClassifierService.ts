/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../core/classifier/Classifier';
import type { PredictionInput } from '../../core/classifier/Predictioninput';
import type { PredictionOutput } from '../../core/classifier/PredictionOutput';

export interface ClassifierService {
  predict(predictionInput: PredictionInput): Promise<PredictionOutput>;
  setClassifier(classifier: Classifier): void;
  getClassifier(): Classifier | undefined;
  unsetClassifier(): void;
}

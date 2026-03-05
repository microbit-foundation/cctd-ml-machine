/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Dataset } from '../dataset/Dataset';
import type { EvaluationResult } from './EvaluationResult';
import type { PredictionOutput } from './PredictionOutput';

export interface ClassifierEvaluator {
  getEvaluation(dataset: Dataset, predictionOutput: PredictionOutput[]): EvaluationResult;
}

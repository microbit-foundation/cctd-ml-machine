/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { PredictionInput } from './Predictioninput';
import type { Dataset } from '../dataset/Dataset';
import type { EvaluationResult } from './EvaluationResult';
import type { PredictionOutput } from './PredictionOutput';

export interface Classifier {
  predict(input: PredictionInput): Promise<PredictionOutput>;
  evaluate(testData: Dataset): Promise<EvaluationResult>;
}

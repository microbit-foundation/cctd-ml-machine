/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Vector } from '../vector/Vector';
import type AccuracyMatrix from './AccuracyMatrix';
import type { RunResult } from './RunResult';

/**
 * EvaluationResult represents the result of evaluating a classifier on a dataset, including metrics such as accuracy.
 */
export interface EvaluationResult extends RunResult {
  getAccuracy(): number;
  getAccuracyMatrix(): AccuracyMatrix;
  getPredictionIndices(): number[];
}

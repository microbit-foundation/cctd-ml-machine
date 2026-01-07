/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { RunResult } from './RunResult';

export interface EvaluationResult extends RunResult {
  getAccuracy(): number;
}

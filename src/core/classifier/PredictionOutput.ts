/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';

export interface PredictionOutput {
  getPrediction(): Vector;
  getPredictedIndex(): number
}

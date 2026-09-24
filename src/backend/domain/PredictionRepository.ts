/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { PredictionOutput } from '../../core/classifier/PredictionOutput';

export interface PredictionRepository {
  savePrediction(predictionOutput: PredictionOutput): void;
}

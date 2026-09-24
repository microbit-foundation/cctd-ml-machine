/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Confidences } from '../../core/entities/Confidences';
import type { NewGesture } from '../../core/entities/NewGesture';

export interface ConfidenceService {
  setConfidences(prediction: Confidences): void;
  getMostConfidentPrediction(): NewGesture | undefined;
}

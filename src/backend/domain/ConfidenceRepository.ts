/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Confidences } from '../../core/entities/Confidences';

export interface ConfidenceRepository {
  setConfidences(confidence: Confidences): void;
  getConfidences(): Confidences;
}

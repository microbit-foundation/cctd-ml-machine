/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Confidences } from '../../../core/entities/Confidences';
import type { NewGesture } from '../../../core/entities/NewGesture';
import type { ConfidenceRepository } from '../ConfidenceRepository';
import type { ConfidenceService } from '../ConfidenceService';
import type { GestureService } from '../GestureService';

export class ConfidenceServiceImpl implements ConfidenceService {
  constructor(
    private confidenceRepository: ConfidenceRepository,
    private gestureService: GestureService,
  ) {}

  getMostConfidentPrediction(): NewGesture | undefined {
    const confidences = this.confidenceRepository.getConfidences();
    if (!confidences) {
      return undefined;
    }
    const mostConfidentGestureID = confidences.getMostConfidentGestureID();
    if (!mostConfidentGestureID) {
      return undefined;
    }
    return this.gestureService.getGesture(mostConfidentGestureID);
  }

  setConfidences(confidences: Confidences): void {
    this.confidenceRepository.setConfidences(confidences);
  }
}

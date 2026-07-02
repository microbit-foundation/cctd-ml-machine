/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { GestureListListener } from '../domain/eventlistener/GestureListListener';
import type { ValidationRepository } from '../domain/ValidationRepository';
import type { ValidationService } from '../domain/ValidationService';

export class ValidationAutoUpdateGestureListener implements GestureListListener {
  private log = new ConsoleLogger('ValidationAutoUpdateGestureListener');

  private validationService?: ValidationService;

  private validationRepository?: ValidationRepository;

  setValidationDependencies(
    validationService: ValidationService,
    validationRepository: ValidationRepository,
  ): void {
    this.validationService = validationService;
    this.validationRepository = validationRepository;
  }

  onGesturesChanged(_gestures: NewGesture[]): void {
    if (!this.validationService || !this.validationRepository) {
      return;
    }
    if (!this.validationRepository.getAutoUpdate()) {
      return;
    }
    void this.validationService.evaluateValidationSet().catch(error => {
      this.log.warn(`Auto update validation failed: ${error}`);
    });
  }
}

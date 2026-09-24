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
import type { ModelTrainingListener } from '../../core/model/ModelTrainingObserver';
import type { ModelTraining } from '../../core/model/ModelTraining';

export class ValidationAutoUpdateListener
  implements GestureListListener, ModelTrainingListener
{
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
    this.updateValidation();
  }

  async onModelTrainingChanged(modelTraining: ModelTraining): Promise<void> {
    if (modelTraining.isTraining() || modelTraining.hasPendingSettings()) {
      return;
    }
    this.updateValidation();
  }

  private updateValidation(): void {
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

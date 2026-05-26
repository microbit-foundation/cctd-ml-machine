/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import ConsoleLogger from '../../../../core/logging/ConsoleLogger';
import type { ClassifierService } from '../../ClassifierService';
import type { DataService } from '../../DataService';
import type { ValidationRepository } from '../../ValidationRepository';
import type { ValidationService } from '../../ValidationService';
import { ValidationResult } from './ValidationResult';

export class ValidationServiceImpl implements ValidationService {

  private log = new ConsoleLogger('ValidationServiceImpl');

  public constructor(
    private classifierService: ClassifierService,
    private validationRepository: ValidationRepository,
    private dataService: DataService,
  ) {}

  public async evaluateValidationSet(): Promise<void> {
    const validationSet = this.dataService.getValidationDataset();
    if (!validationSet.isValid() || validationSet.isEmpty()) {
      this.log.warn('Validation dataset is not valid or empty, skipping evaluation');
      return;
    }
    const classifier = this.classifierService.getClassifier();
    if (!classifier) {
      this.log.warn('No classifier available, skipping validation evaluation');
      return;
    }
    const evaluation = await classifier.evaluate(validationSet);

    const validationResult = new ValidationResult(evaluation);
    this.validationRepository.saveValidationResult(validationResult);
  }
}

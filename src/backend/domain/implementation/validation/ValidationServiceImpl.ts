/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { ClassifierService } from '../../ClassifierService';
import type { DataService } from '../../DataService';
import type { ValidationRepository } from '../../ValidationRepository';
import type { ValidationService } from '../../ValidationService';
import { ValidationResult } from './ValidationResult';

export class ValidationServiceImpl implements ValidationService {
  public constructor(
    private classifierService: ClassifierService,
    private validationRepository: ValidationRepository,
    private dataService: DataService,
  ) {}

  public async evaluateValidationSet(): Promise<void> {
    const validationSet = this.dataService.getValidationDataset();
    const classifier = this.classifierService.getClassifier();
    const evaluation = await classifier.evaluate(validationSet);

    const validationResult = new ValidationResult(evaluation);
    this.validationRepository.saveValidationResult(validationResult);
  }
}

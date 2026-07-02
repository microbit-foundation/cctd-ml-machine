/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ValidationService } from '../domain/ValidationService';
import type { AbstractStates } from '../statemanagement/AbstractStates';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { ValidationResult } from '../domain/implementation/validation/ValidationResult';
import type { Dataset } from '../../core/dataset/Dataset';
import type { DataService } from '../domain/DataService';

export class ValidationController {
  constructor(
    private validationService: ValidationService,
    private dataservice: DataService,
    private states: AbstractStates,
  ) {}

  public async evaluateValidationSet(): Promise<void> {
    await this.validationService.evaluateValidationSet();
  }

  public shouldAutoUpdate(): AbstractState<boolean> {
    return this.states.getValidationAutoUpdate();
  }

  public getValidationResult(): AbstractState<ValidationResult | undefined> {
    return this.states.getValidationResult();
  }

  public getValidationDataset(): Dataset {
    return this.dataservice.getValidationDataset();
  }
}

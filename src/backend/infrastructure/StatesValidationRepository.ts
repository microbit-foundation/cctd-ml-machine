/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ValidationResult } from '../domain/implementation/validation/ValidationResult';
import type { ValidationRepository } from '../domain/ValidationRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesValidationRepository implements ValidationRepository {
  constructor(private states: AbstractStates) {}

  clearValidationResult(): void {
    this.states.getValidationResult().set(undefined);
  }

  saveValidationResult(validationResult: ValidationResult): void {
    this.states.getValidationResult().set(validationResult);
  }

  getValidationResult(): ValidationResult | undefined {
    return this.states.getValidationResult().get();
  }

  getAutoUpdate(): boolean {
    return this.states.getValidationAutoUpdate().get();
  }

  setAutoUpdate(value: boolean): void {
    this.states.getValidationAutoUpdate().set(value);
  }
}

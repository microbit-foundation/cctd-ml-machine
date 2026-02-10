import type { ValidationResult } from '../domain/implementation/validation/ValidationResult';
import type { ValidationRepository } from '../domain/ValidationRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesValidationRepository implements ValidationRepository {
  constructor(private states: AbstractStates) {}

  saveValidationResult(validationResult: ValidationResult): void {
    this.states.getValidationResult().set(validationResult);
  }

  getValidationResult(): ValidationResult | undefined {
    return this.states.getValidationResult().get();
  }
}

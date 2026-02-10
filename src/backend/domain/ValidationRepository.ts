import type { ValidationResult } from './implementation/validation/ValidationResult';

export interface ValidationRepository {
  saveValidationResult(validationResult: ValidationResult): void;
  getValidationResult(): ValidationResult | undefined;
}

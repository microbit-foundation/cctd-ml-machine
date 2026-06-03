import type { ValidationResult } from './implementation/validation/ValidationResult';

export interface ValidationRepository {
  saveValidationResult(validationResult: ValidationResult): void;
  clearValidationResult(): void;
  getValidationResult(): ValidationResult | undefined;
}

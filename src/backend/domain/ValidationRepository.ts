import type { ValidationSet } from "../../core/entities/validation/ValidationSet";
import type { ValidationResult } from "./implementation/validation/ValidationResult";

export interface ValidationRepository {
    saveValidationSet(validationSet: ValidationSet): void;
    getValidationSet(): ValidationSet;
    saveValidationResult(validationResult: ValidationResult): void;
    getValidationResult(): ValidationResult;
}
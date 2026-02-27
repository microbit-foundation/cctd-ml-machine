/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { ValidationResult } from './implementation/validation/ValidationResult';

export interface ValidationService {
  evaluateValidationSet(): Promise<void>;
  getValidationResult(): ValidationResult;
}

/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface ValidationService {
  evaluateValidationSet(): Promise<void>;
  clearValidationResult(): void;
  setAutoUpdate(value: boolean): void;
}

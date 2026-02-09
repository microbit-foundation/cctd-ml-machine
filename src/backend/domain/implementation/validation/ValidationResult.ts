/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { EvaluationResult } from '../../../../core/classifier/EvaluationResult';
import type Matrix from '../../../../core/entities/Matrix';

export class ValidationResult {
  public constructor(
    private evaluationResult: EvaluationResult
  ) { }

  public getAccuracy(): number {
    return this.evaluationResult.getAccuracy();
  }

  public getMatrix(): Matrix<number> {
    throw new Error('Method not implemented.');
  }
}

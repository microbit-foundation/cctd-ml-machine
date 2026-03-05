/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type Matrix from '../../../../core/entities/Matrix';

export class ValidationResult {
  public constructor(
    private accuracy: number,
    private matrix: Matrix<number>,
  ) {}

  public getAccuracy(): number {
    return this.accuracy;
  }

  public getMatrix(): Matrix<number> {
    return this.matrix;
  }
}

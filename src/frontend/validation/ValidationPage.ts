/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Matrix from '../../core/entities/Matrix';

export interface ValidationSetMatrix {
  matrix: Matrix<number>;
  accurateResults: number;
}

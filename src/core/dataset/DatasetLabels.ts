/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';

export interface DatasetLabels {
  /**
   * Examlpe [0,0,0,1,0] for a index representation of 3
   */
  getLabelVectors(): Vector[];
}

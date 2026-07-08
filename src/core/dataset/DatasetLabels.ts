/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';
import type { DataIndexLabel } from './DataIndexLabel';

export interface DatasetLabels {
  /**
   * Examlpe [[0,0,0,1,0]] for a index representation of 3 out of 5 classes in a dataset with 1 example.
   */
  getLabelVectors(): Vector[];
  /**
   * Complex label vectors containing logic for index computation. (Wrapper of label vectors)
   */
  getIndexLabels(): DataIndexLabel[];
}

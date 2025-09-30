/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';

export class VectorDatasetLabel {
  private labelVector: Vector;

  public constructor(labelVector: Vector) {
    this.labelVector = labelVector;
  }

  public getIndex(): number {
    const computedIndex = this.labelVector.getValue().findIndex(val => val === 1);
    if (computedIndex === -1) {
      throw new Error(
        'Attempted to find the index of a label vector, where the label vector did not have a 1-value index',
      );
    }
    return computedIndex;
  }
}

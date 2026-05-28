/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';

export class DataIndexLabel {
  private labelVector: Vector;
  private index: number;

  public constructor(labelVector: Vector) {
    this.labelVector = labelVector;
    this.validateLabelVector(labelVector);
    const computedIndex = this.labelVector.getValue().findIndex(val => val === 1);
    this.index = computedIndex;
  }

  public getIndex(): number {
    return this.index;
  }

  private validateLabelVector(labelVector: Vector): void {
    const values = labelVector.getValue();
    const numberOfOnes = values.filter(val => val === 1).length;
    if (numberOfOnes !== 1) {
      throw new Error(
        `Invalid label vector: ${labelVector.getValue()}. A label vector must have exactly one index with the value 1.`,
      );
    }
  }
}

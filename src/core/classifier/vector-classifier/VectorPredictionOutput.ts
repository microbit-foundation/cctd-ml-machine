/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../../vector/Vector';
import type { PredictionOutput } from '../PredictionOutput';

export class VectorPredictionOutput implements PredictionOutput {
  private vector: Vector;

  constructor(inputVector: Vector) {
    this.vector = inputVector;
  }

  public getPrediction(): Vector {
    return this.vector;
  }

  public getPredictedIndex(): number {
    const roundedVector = this.getRoundedPrediction();
    const index = roundedVector.getValue().findIndex(value => value === 1);
    if (index === -1) {
      throw new Error(`Invalid prediction vector: ${roundedVector.getValue()}`);
    }
    return index;
  }

  private getRoundedPrediction(): Vector {
    return this.vector.round(0);
  }
}

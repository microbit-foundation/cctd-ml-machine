/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../../vector/Vector';
import type { PredictionInput } from '../Predictioninput';
import type { PredictionOutput } from '../PredictionOutput';

export class VectorPredictionOutput implements PredictionOutput {
  constructor(private predictionInput: PredictionInput, private outputVector: Vector) {
  }

  public getPrediction(): Vector {
    return this.outputVector;
  }

  public getPredictedIndex(): number {
    const roundedVector = this.getRoundedPrediction();
    const index = roundedVector.getValue().findIndex(value => value === 1);
    if (index === -1) {
      throw new Error(`Invalid prediction vector: ${roundedVector.getValue()}`);
    }
    return index;
  }

  public getInput(): PredictionInput {
    return this.predictionInput;
  }

  private getRoundedPrediction(): Vector {
    return this.outputVector.round(0);
  }

  toString(): string {
    return `VectorPredictionOutput(predictionInput=${JSON.stringify(this.predictionInput)}, outputVector=${this.outputVector.getValue()})`;
  }
}

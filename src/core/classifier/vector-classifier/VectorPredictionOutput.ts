/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { DataIndexLabel } from '../../dataset/DataIndexLabel';
import type { Vector } from '../../vector/Vector';
import type { PredictionInput } from '../Predictioninput';
import type { PredictionOutput } from '../PredictionOutput';

export class VectorPredictionOutput implements PredictionOutput {
  constructor(private predictionInput: PredictionInput, private outputVector: Vector) {
  }

  getPredcitionByClassIndex(classIndex: number): number {
    const predictionValue = this.outputVector.getValueByIndex(classIndex);
    if (predictionValue === undefined) {
      return 0;
    }
    return predictionValue;
  }

  public getPrediction(): Vector {
    return this.outputVector;
  }

  /**
   * Returns the index of the predicted class or -1 if no class is predicted (i.e., all values are 0).
   */
  public getPredictedIndex(): number {
    const roundedVector = this.getRoundedPrediction();
    const index = roundedVector.getValue().findIndex(value => value === 1);
    return index;
  }

  public getInput(): PredictionInput {
    return this.predictionInput;
  }

  getDataIndexLabel(): DataIndexLabel {
    const rounded = this.getRoundedPrediction()
    return new DataIndexLabel(rounded);
  }

  private getRoundedPrediction(): Vector {
    return this.outputVector.round(0);
  }

  toString(): string {
    return `VectorPredictionOutput(predictionInput=${JSON.stringify(this.predictionInput)}, outputVector=${this.outputVector.getValue()})`;
  }
}

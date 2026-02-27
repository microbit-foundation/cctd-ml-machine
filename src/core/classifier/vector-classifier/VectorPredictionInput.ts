/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../../vector/Vector';
import type { PredictionInput } from '../Predictioninput';

export class VectorPredictionInput implements PredictionInput {
  private vector: Vector;

  constructor(inputVector: Vector) {
    this.vector = inputVector;
  }

  public getInput(): Vector {
    return this.vector;
  }
}

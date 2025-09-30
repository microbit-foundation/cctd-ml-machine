/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../entities/vector/Vector';
import type { PredictionOutput } from './PredictionOutput';

export class VectorPredictionOutput implements PredictionOutput {
  private vector: Vector;

  constructor(inputVector: Vector) {
    this.vector = inputVector;
  }

  public getPrediction(): Vector {
    return this.vector;
  }
}

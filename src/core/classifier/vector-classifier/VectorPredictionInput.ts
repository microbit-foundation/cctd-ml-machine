/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../entities/Axis';
import type { Filter } from '../../filter/Filter';
import BaseVector from '../../vector/BaseVector';
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

  // TODO: Maybe this should be in the data service instead. It will already know the axes, filters and data!
  public static getFilteredForAxes(
    filters: Filter[],
    samples: Vector[],
    axes: Axis[],
  ): VectorPredictionInput {
    if (samples.length === 0) {
      return new VectorPredictionInput(new BaseVector([]));
    }
    const sampleVectors = samples.map(
      e =>
        new BaseVector(
          e
            .getValue()
            .filter(
              (vecVal, vecIdx) => axes.findIndex(axis => axis.index === vecIdx) !== -1,
            ),
        ),
    );
    const vectorSize = sampleVectors[0].getSize();
    const filtered = new BaseVector(
      Array.from({ length: vectorSize }, (_, i) =>
        filters.map(filter => filter.filter(sampleVectors.map(e => e.getValue()[i]))),
      ).flat(),
    );

    return new VectorPredictionInput(filtered);
  }
}

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
    // Keep feature ordering identical to training: iterate filters first, then axes.
    const samplesByAxis = axes.map(axis =>
      samples.map(sample => sample.getValue()[axis.index]),
    );

    const features: number[] = [];
    for (let i = 0; i < filters.length; i++) {
      for (let j = 0; j < samplesByAxis.length; j++) {
        features.push(filters[i].filter(samplesByAxis[j]));
      }
    }

    const filtered = new BaseVector(features);

    return new VectorPredictionInput(filtered);
  }
}

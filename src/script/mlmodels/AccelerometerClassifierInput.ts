/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import Filters from '../domain/Filters';
import { stores } from '../stores/Stores';
import type { ClassifierInput } from '../domain/ClassifierInput';

class AccelerometerClassifierInput implements ClassifierInput {
  constructor(
    private xs: number[],
    private ys: number[],
    private zs: number[],
  ) {}

  public getInput(filters: Filters): number[] {
    // TODO: Bad! How should we go about deciding what axes are provided for prediction when axes are highlighted?
    const axis = get(stores.getHighlightedAxis());
    if (axis !== undefined) {
      if (axis === 0) {
        return [...filters.compute(this.xs)];
      }
      if (axis === 1) {
        return [...filters.compute(this.ys)];
      }
      if (axis === 2) {
        return [...filters.compute(this.zs)];
      }
    }

    return [
      ...filters.compute(this.xs),
      ...filters.compute(this.ys),
      ...filters.compute(this.zs),
    ];
  }

  public getNumberOfSamples(): number {
    return this.xs.length; // Assuming all axes have the same length
  }
}

export default AccelerometerClassifierInput;

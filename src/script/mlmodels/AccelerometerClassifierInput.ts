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
    const axes = get(stores.getHighlightedAxes());
    if (axes.length === 1) {
      if (axes[0].index === 0) {
        return [...filters.compute(this.xs)];
      }
      if (axes[0].index === 1) {
        return [...filters.compute(this.ys)];
      }
      if (axes[0].index === 2) {
        return [...filters.compute(this.zs)];
      }
    }

    console.warn("Good input provider is not implemented")

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

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import ClassifierInput from '../domain/ClassifierInput';
import Filters from '../domain/Filters';
import { highlightedAxis } from '../stores/uiStore';
import Axes from '../domain/Axes';

class AccelerometerClassifierInput implements ClassifierInput {
  constructor(
    private xs: number[],
    private ys: number[],
    private zs: number[],
  ) {}

  public getInput(filters: Filters): number[] {
    // TODO: Bad! How should we go about deciding what axes are provided for prediction when axes are highlighted?
    const axis = get(highlightedAxis);
    if (axis) {
      if (axis === Axes.X) {
        return [...filters.compute(this.xs)];
      }
      if (axis === Axes.Y) {
        return [...filters.compute(this.ys)];
      }
      if (axis === Axes.Z) {
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

export class SingleAxisClassifierInput implements ClassifierInput {
  constructor(private axis: number[]) {}

  public getInput(filters: Filters): number[] {
    return [...filters.compute(this.axis)];
  }

  public getNumberOfSamples(): number {
    return this.axis.length;
  }
}

export default AccelerometerClassifierInput;

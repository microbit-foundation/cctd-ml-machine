/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Filters from './Filters';
import type { Vector } from './Vector';

export class ClassifierInput {
  public constructor(private samples: Vector[]) {}

  public getInput(filters: Filters): number[] {
    if (this.samples.length === 0) {
      return [];
    }
    const vectorSize = this.samples[0].getSize();

    return Array.from({ length: vectorSize }, (_, i) =>
      filters.compute(this.samples.map(e => e.getValue()[i])),
    ).flat();
  }

  public getNumberOfSamples(): number {
    return this.samples.length;
  }
}

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Filters from './Filters';
import type { LiveDataVector } from './stores/LiveDataVector';

export class ClassifierInput {
  public constructor(private samples: LiveDataVector[]) {}

  public getInput(filters: Filters): number[] {
    if (this.samples.length === 0) {
      return [];
    }

    const vectorSize = this.samples[0].getSize();
    const inputUnfiltered: number[][] = new Array(vectorSize).fill([]);

    this.samples.forEach(smpl =>
      smpl.getVector().forEach((k, idx) => {
        inputUnfiltered[idx].push(k);
      }),
    );

    return inputUnfiltered.flatMap(e => filters.compute(e));
  }

  public getNumberOfSamples(): number {
    return this.samples.length;
  }
}

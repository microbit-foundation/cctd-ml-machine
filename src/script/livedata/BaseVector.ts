/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { LiveDataVector } from '../domain/stores/LiveDataVector';

class BaseVector implements LiveDataVector {
  public constructor(
    private numbers: number[],
    private labels: string[],
  ) {}

  public getLabels(): string[] {
    return this.labels;
  }

  public getSize(): number {
    return this.numbers.length;
  }

  public getVector(): number[] {
    return this.numbers;
  }
}

export default BaseVector;

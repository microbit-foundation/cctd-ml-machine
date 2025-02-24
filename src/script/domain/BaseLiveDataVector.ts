/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import BaseVector from './BaseVector';
import { type LiveDataVector } from './stores/LiveDataVector';

class BaseLiveDataVector implements LiveDataVector {
  public constructor(
    private base: BaseVector,
    private labels: string[],
  ) {}

  public getLabels(): string[] {
    return this.labels;
  }

  public getSize(): number {
    return this.base.getSize();
  }

  public getValue(): number[] {
    return this.base.getValue();
  }

  public add(vector: BaseLiveDataVector): BaseLiveDataVector {
    const vecBase = new BaseVector(vector.getValue());
    return new BaseLiveDataVector(this.base.add(vecBase), this.labels);
  }

  public subtract(vector: BaseLiveDataVector): BaseLiveDataVector {
    const vecBase = new BaseVector(vector.getValue());
    return new BaseLiveDataVector(this.base.subtract(vecBase), this.labels);
  }

  public divide(vector: BaseLiveDataVector): BaseLiveDataVector {
    const vecBase = new BaseVector(vector.getValue());
    return new BaseLiveDataVector(this.base.divide(vecBase), this.labels);
  }
}

export default BaseLiveDataVector;

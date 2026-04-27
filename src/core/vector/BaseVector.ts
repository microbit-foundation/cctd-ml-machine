/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from './Vector';

class BaseVector implements Vector {
  constructor(private values: number[]) {}

  public getSize(): number {
    return this.values.length;
  }

  public getValue(): number[] {
    return this.values;
  }

  getValueByIndex(index: number): number {
    if (index < 0 || index >= this.values.length) {
      throw new Error(`Index out of bounds. Attempted to access index ${index} in vector of size ${this.getSize()}`);
    }
    return this.values[index];
  }

  public divideByScalar(scalar: number): Vector {
    const vn = this.values.map(val => val / scalar);
    return new BaseVector(vn);
  }

  public divide(vector: Vector): BaseVector {
    if (this.getSize() !== vector.getSize()) {
      throw new Error(
        `Attempted to divide two vectors of unequal size. Vector1 size: ${this.getSize()} - Vector2 size: ${vector.getSize()}`,
      );
    }
    const v1 = this.getValue();
    const v2 = vector.getValue();

    const vn = v1.map((val, inx) => val / v2[inx]);
    return new BaseVector(vn);
  }

  public subtract(vector: Vector): BaseVector {
    if (this.getSize() !== vector.getSize()) {
      throw new Error(
        `Attempted to subtract two vectors of unequal size. Vector1 size: ${this.getSize()} - Vector2 size: ${vector.getSize()}`,
      );
    }
    const v1 = this.getValue();
    const v2 = vector.getValue();

    const vn = v1.map((val, inx) => val - v2[inx]);
    return new BaseVector(vn);
  }

  public add(vector: Vector): BaseVector {
    if (this.getSize() !== vector.getSize()) {
      throw new Error(
        `Attempted to add two vectors of unequal size. Vector1 size: ${this.getSize()} - Vector2 size: ${vector.getSize()}`,
      );
    }
    const v1 = this.getValue();
    const v2 = vector.getValue();

    const vn = v1.map((val, inx) => val + v2[inx]);
    return new BaseVector(vn);
  }

  extract(indices: number[]): Vector {
    const extractedValues = indices.map(index => {
      if (index < 0 || index >= this.values.length) {
        throw new Error(`Index out of bounds. Attempted to access index ${index} in vector of size ${this.getSize()}`);
      }
      return this.values[index];
    });
    return new BaseVector(extractedValues);
  }
}

export default BaseVector;

/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export interface Vector {
  getSize(): number;

  getValue(): number[];

  getValueByIndex(index: number): number;

  divide(vector: Vector): Vector;

  divideByScalar(scalar: number): Vector;

  subtract(vector: Vector): Vector;

  add(vector: Vector): Vector;

  extract(indices: number[]): Vector;
}

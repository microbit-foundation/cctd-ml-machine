/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { describe, test, expect } from 'vitest';
import AccuracyMatrix from '../../core/classifier/AccuracyMatrix';
import Matrix from '../../core/entities/Matrix';

describe('AccuracyMatrix', () => {
  test('constructs from matrix and returns row copy', () => {
    const input = [
      [1, 2],
      [3, 4],
    ];
    const m = new AccuracyMatrix(new Matrix<number>(input));
    const row0 = m.getRow(0);
    expect(row0).toEqual([1, 2]);
    // modifying returned row should not affect internal matrix
    row0[0] = 999;
    expect(m.getRow(0)).toEqual([1, 2]);
  });

  test('increment and get work', () => {
    const m = AccuracyMatrix.fromSize(2);
    m.increment(0, 1);
    expect(m.get(0, 1)).toBe(1);
    m.increment(0, 1, 2);
    expect(m.get(0, 1)).toBe(3);
  });

  test('set and get work', () => {
    const m = AccuracyMatrix.fromSize(3);
    m.set(1, 0, 5);
    expect(m.get(1, 0)).toBe(5);
  });

  test('toArray returns deep copy', () => {
    const input = [
      [7, 8],
      [9, 10],
    ];
    const m = new AccuracyMatrix(new Matrix<number>(input));
    const arr = m.toArray();
    expect(arr).toEqual(input);
    arr[0][0] = 12345;
    expect(m.get(0, 0)).toBe(7);
  });

  test('throws on empty or non-square matrix', () => {
    expect(() => new AccuracyMatrix(new Matrix<number>([]))).toThrow();
    expect(() => new AccuracyMatrix(new Matrix<number>([[1, 2], [3]]))).toThrow();
  });

  test('throws on unknown gesture id', () => {
    const m = AccuracyMatrix.fromSize(2);
    expect(() => m.getRow(5 as any)).toThrow();
  });
});

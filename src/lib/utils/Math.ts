/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import BaseVector from '../domain/BaseVector';
import type { Vector } from '../domain/Vector';

export const getStandardDeviation = (vectors: Vector[]): Vector => {
  const input = vectors.map(e => e.getValue());
  const n = input.length;
  if (n === 0) return new BaseVector([]);

  const dimension = input[0].length;

  const mean = getMean(vectors).getValue();

  // Calculate the variance
  const variance = new Array(dimension).fill(0);
  for (let vec of input) {
    for (let i = 0; i < dimension; i++) {
      const diff = vec[i] - mean[i];
      variance[i] += diff * diff;
    }
  }
  for (let i = 0; i < dimension; i++) {
    variance[i] /= n;
  }

  // Calculate the standard deviation
  const stdDev = variance.map(Math.sqrt);

  return new BaseVector(stdDev);
};

export const getMean = (vectors: Vector[]): Vector => {
  const input = vectors.map(e => e.getValue());
  const n = input.length;
  if (n === 0) return new BaseVector([]);

  const dimension = input[0].length;
  // Calculate the mean vector
  const mean = new Array(dimension).fill(0);
  for (let vec of input) {
    for (let i = 0; i < dimension; i++) {
      mean[i] += vec[i];
    }
  }
  for (let i = 0; i < dimension; i++) {
    mean[i] /= n;
  }
  return new BaseVector(mean);
};

export const findLargestIndex = (arr: number[]) => {
  if (arr.length === 0) return -1; // Handle empty array case

  let maxIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[maxIndex]) {
      maxIndex = i;
    }
  }
  return maxIndex;
};

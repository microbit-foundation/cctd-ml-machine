/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';

export const distanceBetween = (p1: Vector, p2: Vector): number => {
  // Check if both points have the same dimension
  if (p1.getSize() !== p2.getSize()) {
    throw new Error(
      'Failed to compuse distance between 2 points. Points must have the same dimension. Got elements of size: ' +
        [p1.getSize(), p2.getSize()].join(' / '),
    );
  }

  // Calculate the distance using the Euclidean formula
  const squaredDifferences = p1.getValue().map((coord, index) => {
    const difference = coord - p2.getValue()[index];
    return difference ** 2;
  });

  const sumOfSquares = squaredDifferences.reduce((sum, value) => sum + value, 0);

  return Math.sqrt(sumOfSquares);
};

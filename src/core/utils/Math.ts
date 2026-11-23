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
  const point1 = p1.getValue();
  const point2 = p2.getValue();

  // Step 1: For each feature, find the difference between the two points,
  // square it (multiply it by itself), and add it to a running total.
  let sumOfSquares = 0;
  for (let i = 0; i < point1.length; i++) {
    const difference = point1[i] - point2[i];
    const squaredDifference = difference * difference;
    sumOfSquares = sumOfSquares + squaredDifference;
  }

  // Step 2: The distance is the square root of that total.
  const distance = Math.sqrt(sumOfSquares);
  return distance;
};

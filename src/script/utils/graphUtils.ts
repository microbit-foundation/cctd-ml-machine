/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Smoothes values by interpolating between old value and new value
 */
export const smoothNewValue = (...values: number[]) => {
  const numberOfValues = values.length;
  let smoothed = 0;
  values.forEach((value, index) => {
    // Using weighted sum
    const weight =
      (numberOfValues - index) / ((numberOfValues * (numberOfValues + 1)) / 2);
    smoothed += value * weight;
  });
  return smoothed;
};

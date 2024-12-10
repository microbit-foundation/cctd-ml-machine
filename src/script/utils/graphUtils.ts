/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../domain/Axis';
import { type TrainingData } from '../domain/ModelTrainer';
import { type MicrobitAccelerometerData } from '../livedata/MicrobitAccelerometerData';

export type Point3D = {
  x: number;
  y: number;
  z: number;
};
/**
 * Type help for d3-3d package
 */
export type Point3DTransformed = Point3D & {
  rotated: { x: number; y: number; z: number };
  projected: { x: number; y: number };
};

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

/**
 * Training data has a flattened datastructure. This can be used to extract just a single axis from the dataset
 */
export const extractAxisFromTrainingData = (
  trainingData: TrainingData,
  axisOffset: number,
  noOfAxes: number,
): TrainingData => {
  return {
    classes: trainingData.classes.map(clazz => {
      return {
        samples: clazz.samples.map(sample => {
          const noOfFilters = sample.value.length / noOfAxes;
          const startIndex = noOfFilters * axisOffset;
          const stopIndex = startIndex + noOfFilters;
          return {
            value: sample.value.filter(
              (_val, index) => index >= startIndex && index < stopIndex,
            ),
          };
        }),
      };
    }),
  };
};

/**
 * Training data has a flattened datastructure. This can be used to extract multiple axes from the dataset
 */
export const extractAxesFromTrainingData = (
  trainingData: TrainingData,
  axes: Axis[],
  noOfAxes: number,
): TrainingData => {
  return {
    classes: trainingData.classes.map(clazz => {
      return {
        samples: clazz.samples.map(sample => {
          return {
            value: axes.flatMap(axis => {
              const noOfFilters = sample.value.length / noOfAxes;
              const startIndex = noOfFilters * axis.index;
              const stopIndex = startIndex + noOfFilters;
              return sample.value.filter(
                (_val, index) => index >= startIndex && index < stopIndex,
              );
            }),
          };
        }),
      };
    }),
  };
};

/**
 * Training data has a flattened datastructure. This can be used to extract just a single filter from the dataset
 *
 * The filterIndex is the index of the filter in the Filters list
 *
 * i.e
 * ```
 * [
 *     Filter.MIN, // 0
 *     Filter.MAX, // 1
 *     Filter.MEAN, // 2
 * ]
 * ```
 */
export const extractFilterFromTrainingData = (
  trainingData: TrainingData,
  filterIndex: number,
  noOfAxes: number,
): TrainingData => {
  return {
    classes: trainingData.classes.map(clazz => {
      return {
        samples: clazz.samples.map(sample => {
          const filterValues = [];
          for (let i = noOfAxes * filterIndex; i < sample.value.length; i += noOfAxes) {
            const element = sample.value[i];
            filterValues.push(element);
          }
          return {
            value: filterValues,
          };
        }),
      };
    }),
  };
};

export const extractAxisFromAccelerometerData = (
  data: MicrobitAccelerometerData[],
  axis: number,
) => {
  switch (axis) {
    case 0:
      return data.map(val => val.x);
    case 1:
      return data.map(val => val.y);
    case 2:
      return data.map(val => val.z);
  }
  throw new Error(`Cannot extract from axis ${axis}`);
};

export const  distanceBetween = (p1: number[], p2: number[]): number => {
  // Check if both points have the same dimension
  if (p1.length !== p2.length) {
      throw new Error("Points must have the same dimension. Got elements of size: " + [p1.length, p2.length].join(" / "));
  }

  // Calculate the distance using the Euclidean formula
  const squaredDifferences = p1.map((coord, index) => {
      const difference = coord - p2[index];
      return difference ** 2;
  });

  const sumOfSquares = squaredDifferences.reduce((sum, value) => sum + value, 0);

  return Math.sqrt(sumOfSquares);
}
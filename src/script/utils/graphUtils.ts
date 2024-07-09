/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Axes from '../domain/Axes';
import { TrainingData } from '../domain/ModelTrainer';
import { MicrobitAccelerometerData } from '../livedata/MicrobitAccelerometerData';

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
  axis: Axes,
) => {
  switch (axis) {
    case Axes.X:
      return data.map(val => val.x);
    case Axes.Y:
      return data.map(val => val.y);
    case Axes.Z:
      return data.map(val => val.z);
  }
};

export const distanceBetween = (point1: Point3D, point2: Point3D): number => {
  const { x: x1, y: y1, z: z1 } = point1;
  const { x: x2, y: y2, z: z2 } = point2;

  const [dx, dy, dz] = [x2 - x1, y2 - y1, z2 - z1];

  const squaredDistance = dx ** 2 + dy ** 2 + dz ** 2;

  return Math.sqrt(squaredDistance);
};

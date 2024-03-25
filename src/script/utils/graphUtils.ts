/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Axes from '../domain/Axes';
import { TrainingData } from '../domain/ModelTrainer';
import { MicrobitAccelerometerData } from '../livedata/MicrobitAccelerometerData';

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
          const startIndex = noOfAxes * axisOffset;
          const stopIndex = startIndex + noOfAxes;
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
          for (
            let i = noOfAxes * filterIndex;
            i < noOfAxes * filterIndex + noOfAxes;
            i++
          ) {
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

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import BaseVector from '../../script/domain/BaseVector';
import { ClassifierInput } from '../../script/domain/ClassifierInput';
import type Filters from '../../script/domain/Filters';
import Matrix from '../../script/domain/Matrix';
import type { MLModel } from '../../script/domain/MLModel';
import type { GestureData } from '../../script/domain/stores/gesture/Gesture';
import type { ValidationSet } from '../../script/domain/ValidationSet';
import { findLargestIndex } from '../../script/utils/Math';

export type ValidationResult = { prediction: number[]; gestureIdx: number }[][];

export interface ValidationSetMatrix {
  matrix: Matrix<number>;
  accurateResults: number;
}

export const createValidationMatrixVisual = (
  validationResult: ValidationResult,
  gestures: GestureData[],
): ValidationSetMatrix => {
  const matrixRaw = createValidationMatrix(validationResult, gestures);

  const accurateResults = gestures.reduce(
    (pre, cur, idx) => pre + matrixRaw.getValues()[idx][idx],
    0,
  );
  return {
    matrix: matrixRaw,
    accurateResults: accurateResults,
  };
};

export const evaluateValidationSet = async (
  validationSets: ValidationSet[],
  model: MLModel,
  filters: Filters,
) => {
  const setEvaluations = validationSets.map(async set => {
    const recordingEvaluations = set.recordings.map(async rec => {
      const samples = rec.samples.map(sample => new BaseVector(sample.vector));
      const classifierInput = new ClassifierInput(samples);
      return await model.predict(new BaseVector(classifierInput.getInput(filters)));
    });

    const predictions = await Promise.all(recordingEvaluations);

    return predictions.map(pred => ({
      gestureIdx: findLargestIndex(pred),
      prediction: pred,
    }));
  });
  return await Promise.all(setEvaluations);
};

export const createValidationMatrix = (
  validationResults: {
    prediction: number[];
    gestureIdx: number;
  }[][],
  gestures: GestureData[],
): Matrix<number> => {
  const matrix = gestures.map((_, row) => {
    const results = validationResults[row];
    if (!results) {
      return gestures.map(_ => 0);
    }
    return gestures.map((_, col) => {
      return results.reduce((pre, cur) => {
        return pre + (cur.gestureIdx === col ? 1 : 0);
      }, 0);
    });
  });
  return new Matrix(matrix).transposed();
};

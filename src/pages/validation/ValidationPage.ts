/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { derived } from 'svelte/store';
import Matrix from '../../script/domain/Matrix';
import type { GestureData } from '../../script/domain/stores/gesture/Gesture';
import type { ValidationResult } from '../../script/domain/stores/ValidationResults';
import { stores } from '../../script/stores/Stores';

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
    (pre, _, idx) => pre + matrixRaw.getValues()[idx][idx],
    0,
  );
  return {
    matrix: matrixRaw,
    accurateResults: accurateResults,
  };
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
  return new Matrix(matrix);
};

export const isValidationSetEmpty = derived(
  stores.getValidationSets(),
  validationSets => {
    return validationSets.reduce((pre, cur) => pre + cur.recordings.length, 0) === 0;
  },
);

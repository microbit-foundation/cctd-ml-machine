/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, test } from 'vitest';
import BaseVector from '../../core/vector/BaseVector';
import { VectorPredictionInput } from '../../core/classifier/vector-classifier/VectorPredictionInput';
import { createFilter } from '../../core/filter/FilterUtils';
import { FilterType } from '../../core/filter/Filter';
import type { Axis } from '../../core/entities/Axis';

describe('VectorPredictionInput', () => {
  test('builds features in training-compatible order (filters first, then axes)', () => {
    const samples = [
      new BaseVector([1, 10, 100]),
      new BaseVector([3, 30, 300]),
      new BaseVector([2, 20, 200]),
    ];
    const selectedAxes: Axis[] = [
      { index: 2, label: 'z' },
      { index: 0, label: 'x' },
    ];
    const filters = [createFilter(FilterType.MAX), createFilter(FilterType.MIN)];

    const predictionInput = VectorPredictionInput.getFilteredForAxes(
      filters,
      samples,
      selectedAxes,
    );

    expect(predictionInput.getInput().getValue()).toStrictEqual([300, 3, 100, 1]);
  });
});

/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
/**
 * @vitest-environment jsdom
 */

import { describe, expect, test, vi } from 'vitest';
import type { Axis } from '../../core/entities/Axis';
import { createFilter } from '../../core/filter/FilterUtils';
import { FilterType } from '../../core/filter/Filter';
import { FilterSelectionListener } from '../../backend/interface-listener/FilterSelectionListener';
import type { ModelService } from '../../backend/domain/ModelService';

describe('FilterSelectionListener', () => {
  test('updates input node count when filters change', () => {
    const modelService = {
      setNeuralNetworkInputNodeCount: vi.fn(),
    } as Pick<ModelService, 'setNeuralNetworkInputNodeCount'>;
    const initialSelectedAxes: Axis[] = [
      { index: 0, label: 'x' },
      { index: 1, label: 'y' },
    ];
    const initialFilters = [createFilter(FilterType.MAX)];
    const listener = new FilterSelectionListener(initialSelectedAxes, initialFilters);
    listener.setModelService(modelService as ModelService);

    listener.onFiltersChanged([
      createFilter(FilterType.MAX),
      createFilter(FilterType.MEAN),
    ]);

    expect(modelService.setNeuralNetworkInputNodeCount).toHaveBeenCalledWith(2, 2);
  });

  test('updates input node count when selected axes change', () => {
    const modelService = {
      setNeuralNetworkInputNodeCount: vi.fn(),
    } as Pick<ModelService, 'setNeuralNetworkInputNodeCount'>;
    const initialFilters = [
      createFilter(FilterType.MAX),
      createFilter(FilterType.MEAN),
      createFilter(FilterType.RMS),
    ];
    const listener = new FilterSelectionListener(
      [
        { index: 0, label: 'x' },
        { index: 1, label: 'y' },
      ],
      initialFilters,
    );
    listener.setModelService(modelService as ModelService);

    listener.onSelectedAxesChanged([{ index: 0, label: 'x' }]);

    expect(modelService.setNeuralNetworkInputNodeCount).toHaveBeenCalledWith(3, 1);
  });

  test('does not reapply the same input node count twice', () => {
    const modelService = {
      setNeuralNetworkInputNodeCount: vi.fn(),
    } as Pick<ModelService, 'setNeuralNetworkInputNodeCount'>;
    const listener = new FilterSelectionListener(
      [{ index: 0, label: 'x' }],
      [createFilter(FilterType.MAX)],
    );
    listener.setModelService(modelService as ModelService);

    listener.onFiltersChanged([createFilter(FilterType.MAX)]);
    listener.onSelectedAxesChanged([{ index: 0, label: 'x' }]);

    expect(modelService.setNeuralNetworkInputNodeCount).toHaveBeenCalledTimes(1);
  });
});

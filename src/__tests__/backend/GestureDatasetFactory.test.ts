/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, test, vi } from 'vitest';
import { GestureDatasetFactory } from '../../backend/application/data/GestureDatasetFactory';
import type { GestureService } from '../../backend/domain/GestureService';
import type { Axis } from '../../core/entities/Axis';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Recording } from '../../core/entities/recording/Recording';
import { Sample } from '../../core/entities/recording/Sample';
import type { Filter } from '../../core/filter/Filter';
import { FilterType } from '../../core/filter/Filter';

function createFilter(
  type: FilterType,
  name: string,
  compute: (values: number[]) => number,
): Filter {
  return {
    filter: compute,
    getType: () => type,
    getName: () => name,
    getDescription: () => `${name} filter for tests`,
    getMinNumberOfSamples: () => 1,
  };
}

function createRecording(id: number, samples: number[][]): Recording {
  return {
    getId: () => id,
    getSamples: () => samples.map(sample => new Sample(sample)),
    getAxes: () => [],
  };
}

function createGesture(
  id: number,
  recordings: Recording[] = [],
  validationRecordings: Recording[] = [],
): NewGesture {
  let regular = recordings;
  let validation = validationRecordings;

  return {
    getID: () => id,
    getName: () => `gesture-${id}`,
    getOutput: () => ({ requiredConfidence: 0.8 }),
    getRecordings: () => regular,
    getValidationRecordings: () => validation,
    getColor: () => '#000000',
    setName: vi.fn(),
    setOutput: vi.fn(),
    setRecordings: (value: Recording[]) => {
      regular = value;
    },
    setValidationRecordings: (value: Recording[]) => {
      validation = value;
    },
  } as unknown as NewGesture;
}

function createFactory(gestures: NewGesture[]): GestureDatasetFactory {
  const gestureService = {
    getGestures: () => gestures,
  } as GestureService;
  return new GestureDatasetFactory(gestureService);
}

describe('GestureDatasetFactory', () => {
  test('applies each filter to each selected axis with axis specific samples', () => {
    const recording = createRecording(1, [
      [1, 2, 9],
      [3, 4, 8],
      [5, 6, 7],
    ]);
    const gesture = createGesture(1, [recording]);
    const selectedAxes: Axis[] = [
      { index: 0, label: 'x' },
      { index: 1, label: 'y' },
    ];
    const filter = createFilter(FilterType.MEAN, 'spy', vi.fn().mockReturnValue(0));
    const factory = createFactory([gesture]);

    factory.buildDataset(g => g.getRecordings(), selectedAxes, [filter]);

    const filterSpy = filter.filter as ReturnType<typeof vi.fn>;
    expect(filterSpy).toHaveBeenCalledTimes(2);
    expect(filterSpy.mock.calls[0][0]).toEqual([1, 3, 5]);
    expect(filterSpy.mock.calls[1][0]).toEqual([2, 4, 6]);
  });

  test('builds one hot labels and feature vectors across gestures and recordings', () => {
    const g1r1 = createRecording(1, [
      [1, 9, 2],
      [3, 8, 4],
    ]);
    const g1r2 = createRecording(2, [
      [0, 0, 10],
      [10, 0, 0],
    ]);
    const g2r1 = createRecording(3, [
      [2, 5, 8],
      [4, 5, 6],
    ]);
    const gestures = [createGesture(1, [g1r1, g1r2]), createGesture(2, [g2r1])];
    const selectedAxes: Axis[] = [
      { index: 0, label: 'x' },
      { index: 2, label: 'z' },
    ];
    const filters: Filter[] = [
      createFilter(FilterType.ACC, 'sum', values =>
        values.reduce((sum, value) => sum + value, 0),
      ),
      createFilter(FilterType.MAX, 'max', values => Math.max(...values)),
    ];
    const factory = createFactory(gestures);

    const dataset = factory.buildDataset(g => g.getRecordings(), selectedAxes, filters);

    expect(dataset.getFeatureSize()).toBe(4);
    expect(dataset.getNumberOfClasses()).toBe(2);
    expect(dataset.getFeatureSet()).toHaveLength(3);
    expect(dataset.getFeatureSet()[0].getFeatures().getValue()).toEqual([4, 6, 3, 4]);
    expect(dataset.getFeatureSet()[1].getFeatures().getValue()).toEqual([10, 10, 10, 10]);
    expect(dataset.getFeatureSet()[2].getFeatures().getValue()).toEqual([6, 14, 4, 8]);
    expect(
      dataset
        .getLabels()
        .getLabelVectors()
        .map(v => v.getValue()),
    ).toEqual([
      [1, 0],
      [1, 0],
      [0, 1],
    ]);
  });

  test('returns an empty dataset when no recordings are available', () => {
    const gestures = [createGesture(1), createGesture(2)];
    const selectedAxes: Axis[] = [
      { index: 0, label: 'x' },
      { index: 1, label: 'y' },
    ];
    const filters: Filter[] = [
      createFilter(FilterType.MAX, 'max', values => Math.max(...values)),
    ];
    const factory = createFactory(gestures);

    const dataset = factory.buildDataset(() => [], selectedAxes, filters);

    expect(dataset.isEmpty()).toBe(true);
    expect(dataset.getFeatureSet()).toEqual([]);
    expect(dataset.getFeatureSize()).toBe(0);
    expect(dataset.getNumberOfClasses()).toBe(2);
    expect(dataset.getFeatureMean().getValue()).toEqual([]);
    expect(dataset.getFeatureStandardDeviation().getValue()).toEqual([]);
    expect(dataset.getLabels().getLabelVectors()).toEqual([]);
  });

  test('computes feature mean and variance vector for non empty datasets', () => {
    const g1 = createGesture(1, [
      createRecording(1, [
        [2, 0, 0],
        [2, 0, 0],
      ]),
      createRecording(2, [
        [4, 0, 0],
        [4, 0, 0],
      ]),
    ]);
    const g2 = createGesture(2, [
      createRecording(3, [
        [6, 0, 0],
        [6, 0, 0],
      ]),
    ]);
    const selectedAxes: Axis[] = [{ index: 0, label: 'x' }];
    const filters: Filter[] = [
      createFilter(
        FilterType.MEAN,
        'mean',
        values => values.reduce((sum, value) => sum + value, 0) / values.length,
      ),
    ];
    const factory = createFactory([g1, g2]);

    const dataset = factory.buildDataset(g => g.getRecordings(), selectedAxes, filters);

    expect(dataset.getFeatureMean().getValue()[0]).toBeCloseTo(4);
    expect(dataset.getFeatureStandardDeviation().getValue()[0]).toBeCloseTo(8 / 3);
    const normalized = dataset
      .getNormalizedFeatureSet()
      .map(fd => fd.getFeatures().getValue()[0]);
    expect(normalized[0]).toBeCloseTo(-0.75);
    expect(normalized[1]).toBeCloseTo(0);
    expect(normalized[2]).toBeCloseTo(0.75);
  });

  test('supports selecting recording source through the getRecordings callback', () => {
    const g1 = createGesture(
      1,
      [createRecording(1, [[1, 0, 0]])],
      [createRecording(11, [[10, 0, 0]])],
    );
    const g2 = createGesture(2, [createRecording(2, [[2, 0, 0]])], []);
    const selectedAxes: Axis[] = [{ index: 0, label: 'x' }];
    const filters: Filter[] = [
      createFilter(FilterType.MAX, 'max', values => Math.max(...values)),
    ];
    const factory = createFactory([g1, g2]);

    const regularDataset = factory.buildDataset(
      gesture => gesture.getRecordings(),
      selectedAxes,
      filters,
    );
    const validationDataset = factory.buildDataset(
      gesture => gesture.getValidationRecordings(),
      selectedAxes,
      filters,
    );

    expect(regularDataset.getFeatureSet()).toHaveLength(2);
    expect(regularDataset.getFeatureSet().map(fd => fd.getFeatures().getValue())).toEqual(
      [[1], [2]],
    );
    expect(validationDataset.getFeatureSet()).toHaveLength(1);
    expect(validationDataset.getFeatureSet()[0].getFeatures().getValue()).toEqual([10]);
  });
});

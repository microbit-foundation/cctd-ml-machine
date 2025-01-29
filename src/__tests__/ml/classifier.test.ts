/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import BaseVector from '../../script/domain/BaseVector';
import { ClassifierInput } from '../../script/domain/ClassifierInput';
import Filters from '../../script/domain/Filters';
import { stores } from '../../script/stores/Stores';
import TestMLModelTrainer from '../mocks/mlmodel/TestMLModelTrainer';
import type { Filter } from '../../script/domain/Filter';
import FilterTypes, { FilterType } from '../../script/domain/FilterTypes';

describe('Classifier tests', () => {
  test('Changing matrix does not mark model as untrained', async () => {
    const gesture = stores.getGestures().createGesture('some gesture');
    stores.getGestures().createGesture('some gesture2');
    await stores.getClassifier().getModel().train(new TestMLModelTrainer(2));

    gesture.setLEDOutput(new Array(25).fill(false) as boolean[]);
    expect(stores.getClassifier().getModel().isTrained()).toBe(true);
  });

  test('Adding gesture marks model as untrained', async () => {
    stores.getGestures().createGesture('some gesture');
    stores.getGestures().createGesture('some gesture2');
    await stores.getClassifier().getModel().train(new TestMLModelTrainer(2));

    stores.getGestures().createGesture('Added gesture');

    expect(stores.getClassifier().getModel().isTrained()).toBe(false);
  });

  test('Removing gesture marks model as untrained', async () => {
    stores.getGestures().createGesture('some gesture');
    stores.getGestures().createGesture('some gesture2');
    const gesture3 = stores.getGestures().createGesture('some gesture2');
    await stores.getClassifier().getModel().train(new TestMLModelTrainer(2));

    stores.getGestures().removeGesture(gesture3.getId());

    expect(stores.getClassifier().getModel().isTrained()).toBe(false);
  });

  test('Classifier input should be correct size', () => {
    const vectors = [
      new BaseVector([1, 1, 1], ['x', 'y', 'z']),
      new BaseVector([2, 2, 2], ['x', 'y', 'z']),
      new BaseVector([3, 3, 3], ['x', 'y', 'z']),
    ];
    const input = new ClassifierInput(vectors);
    const filterMax: Filter = FilterTypes.createFilter(FilterType.MAX);
    const filterMean: Filter = FilterTypes.createFilter(FilterType.MEAN);
    const filterMin: Filter = FilterTypes.createFilter(FilterType.MIN);
    const filters: Filters = new Filters(writable([filterMax, filterMean, filterMin]));
    expect(input.getInput(filters).length).toBe(3 * 3);
  });

  test('Max Filter should return max of two vectors', () => {
    const vectors = [
      new BaseVector([1, 2, 3], ['x', 'y', 'z']),
      new BaseVector([4, 5, 6], ['x', 'y', 'z']),
    ];
    const input = new ClassifierInput(vectors);
    const filterMax: Filter = FilterTypes.createFilter(FilterType.MAX);
    const filters: Filters = new Filters(writable([filterMax]));
    expect(input.getInput(filters)).toStrictEqual([4, 5, 6]);
  });

  test('Filters should correctly consider all vectors 1d', () => {
    const vectors = [
      new BaseVector([1], ['x']),
      new BaseVector([4], ['x']),
      new BaseVector([10], ['x']),
    ];
    const input = new ClassifierInput(vectors);
    const filterMax: Filter = FilterTypes.createFilter(FilterType.MAX);
    const filterMean: Filter = FilterTypes.createFilter(FilterType.MEAN);
    const filterMin: Filter = FilterTypes.createFilter(FilterType.MIN);
    const filters: Filters = new Filters(writable([filterMax, filterMean, filterMin]));
    expect(input.getInput(filters).length).toBe(3);
    expect(input.getInput(filters)).toStrictEqual([10, 5, 1]);
  });

  test('Filters should correctly consider all vectors 2d', () => {
    const vectors = [
      new BaseVector([1, 2], ['x', 'y']),
      new BaseVector([4, 8], ['x', 'y']),
      new BaseVector([10, 20], ['x', 'y']),
    ];
    const input = new ClassifierInput(vectors);
    const filterMax: Filter = FilterTypes.createFilter(FilterType.MAX);
    const filterMin: Filter = FilterTypes.createFilter(FilterType.MIN);
    const filters: Filters = new Filters(writable([filterMax, filterMin]));
    expect(input.getInput(filters)).toStrictEqual([
      // x value max/min
      10, 1,
      // y value max/min
      20, 2,
    ]);
  });
});

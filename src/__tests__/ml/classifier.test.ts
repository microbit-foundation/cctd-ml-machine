/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable } from 'svelte/store';
import BaseLiveDataVector from '../../lib/domain/BaseLiveDataVector';
import { ClassifierInput } from '../../lib/domain/ClassifierInput';
import Filters from '../../lib/domain/Filters';
import { stores } from '../../lib/stores/Stores';
import TestMLModelTrainer from '../mocks/mlmodel/TestMLModelTrainer';
import type { Filter } from '../../lib/domain/Filter';
import FilterTypes, { FilterType } from '../../lib/domain/FilterTypes';
import ClassifierFactory from '../../lib/domain/ClassifierFactory';
import LayersModelTrainer from '../../lib/mlmodels/LayersModelTrainer';
import StaticConfiguration from '../../StaticConfiguration';
import TestTrainingDataRepository from '../mocks/TestTrainingDataRepository';
import TestGestureRepository from '../mocks/TestGestureRepository';
import Confidences from '../../lib/domain/stores/Confidences';
import BaseVector from '../../lib/domain/BaseVector';
import Snackbar from '../../components/features/snackbar/Snackbar';

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
      new BaseLiveDataVector(new BaseVector([1, 1, 1]), ['x', 'y', 'z']),
      new BaseLiveDataVector(new BaseVector([2, 2, 2]), ['x', 'y', 'z']),
      new BaseLiveDataVector(new BaseVector([3, 3, 3]), ['x', 'y', 'z']),
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
      new BaseLiveDataVector(new BaseVector([1, 2, 3]), ['x', 'y', 'z']),
      new BaseLiveDataVector(new BaseVector([4, 5, 6]), ['x', 'y', 'z']),
    ];
    const input = new ClassifierInput(vectors);
    const filterMax: Filter = FilterTypes.createFilter(FilterType.MAX);
    const filters: Filters = new Filters(writable([filterMax]));
    expect(input.getInput(filters)).toStrictEqual([4, 5, 6]);
  });

  test('Filters should correctly consider all vectors 1d', () => {
    const vectors = [
      new BaseLiveDataVector(new BaseVector([1]), ['x']),
      new BaseLiveDataVector(new BaseVector([4]), ['x']),
      new BaseLiveDataVector(new BaseVector([10]), ['x']),
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
      new BaseLiveDataVector(new BaseVector([1, 2]), ['x', 'y']),
      new BaseLiveDataVector(new BaseVector([4, 8]), ['x', 'y']),
      new BaseLiveDataVector(new BaseVector([10, 20]), ['x', 'y']),
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

  test('Classifying Should Not Throw', async () => {
    const vectors = [
      new BaseLiveDataVector(new BaseVector([1, 2, 4]), ['x', 'y', 'z']),
      new BaseLiveDataVector(new BaseVector([4, 8, 16]), ['x', 'y', 'z']),
      new BaseLiveDataVector(new BaseVector([10, 20, 40]), ['x', 'y', 'z']),
    ];
    const classifierInput = new ClassifierInput(vectors);
    const filterMax: Filter = FilterTypes.createFilter(FilterType.MAX);
    const filterMean: Filter = FilterTypes.createFilter(FilterType.MEAN);
    const filterMin: Filter = FilterTypes.createFilter(FilterType.MIN);
    const filters: Filters = new Filters(writable([filterMax, filterMean, filterMin]));

    let iterations = 0;

    const trainingData = new TestTrainingDataRepository();
    const trainedModel = await new LayersModelTrainer(
      StaticConfiguration.defaultNeuralNetworkSettings,
      () => (iterations += 1),
    ).trainModel(trainingData);
    const model = writable(trainedModel);

    const gestureRepository = new TestGestureRepository();
    gestureRepository.addGesture({
      color: 'blue',
      ID: 1,
      name: 'test',
      output: {},
      recordings: [],
    });
    gestureRepository.addGesture({
      color: 'blue',
      ID: 2,
      name: 'test',
      output: {},
      recordings: [],
    });
    gestureRepository.addGesture({
      color: 'blue',
      ID: 3,
      name: 'test',
      output: {},
      recordings: [],
    });

    const confidences = new Confidences();
    const classifier = new ClassifierFactory().buildClassifier(
      model,
      async () => void 0,
      filters,
      gestureRepository,
      (gestureId, confidence) => confidences.setConfidence(gestureId, confidence),
      new Snackbar(),
    );

    expect(async () => await classifier.classify(classifierInput)).not.throws();
  });

  test('Classifier should set confidence', async () => {
    const vectors = [
      new BaseLiveDataVector(new BaseVector([1, 2, 4]), ['x', 'y', 'z']),
      new BaseLiveDataVector(new BaseVector([4, 8, 16]), ['x', 'y', 'z']),
      new BaseLiveDataVector(new BaseVector([10, 20, 40]), ['x', 'y', 'z']),
    ];
    const classifierInput = new ClassifierInput(vectors);
    const filterMax: Filter = FilterTypes.createFilter(FilterType.MAX);
    const filterMean: Filter = FilterTypes.createFilter(FilterType.MEAN);
    const filterMin: Filter = FilterTypes.createFilter(FilterType.MIN);
    const filters: Filters = new Filters(writable([filterMax, filterMean, filterMin]));

    let iterations = 0;

    const trainingData = new TestTrainingDataRepository();
    const trainedModel = await new LayersModelTrainer(
      StaticConfiguration.defaultNeuralNetworkSettings,
      () => (iterations += 1),
    ).trainModel(trainingData);
    const model = writable(trainedModel);

    const gestureRepository = new TestGestureRepository();
    gestureRepository.addGesture({
      color: 'blue',
      ID: 1,
      name: 'test',
      output: {},
      recordings: [],
    });
    gestureRepository.addGesture({
      color: 'blue',
      ID: 2,
      name: 'test',
      output: {},
      recordings: [],
    });
    gestureRepository.addGesture({
      color: 'blue',
      ID: 3,
      name: 'test',
      output: {},
      recordings: [],
    });

    const confidences = new Confidences();

    const classifier = new ClassifierFactory().buildClassifier(
      model,
      async () => void 0,
      filters,
      gestureRepository,
      (gestureId, confidence) => confidences.setConfidence(gestureId, confidence),
      new Snackbar(),
    );

    await classifier.classify(classifierInput);

    expect(get(confidences).size).toBe(3);
  });

  test(
    'Classifier should correctly classify',
    async () => {
      const vectors = [
        new BaseLiveDataVector(new BaseVector([1, 2, 4]), ['x', 'y', 'z']),
        new BaseLiveDataVector(new BaseVector([4, 8, 16]), ['x', 'y', 'z']),
        new BaseLiveDataVector(new BaseVector([10, 20, 40]), ['x', 'y', 'z']),
      ];
      const classifierInput = new ClassifierInput(vectors);
      const filterMax: Filter = FilterTypes.createFilter(FilterType.MAX);
      const filterMean: Filter = FilterTypes.createFilter(FilterType.MEAN);
      const filterMin: Filter = FilterTypes.createFilter(FilterType.MIN);
      const filters: Filters = new Filters(writable([filterMax, filterMean, filterMin]));

      let iterations = 0;

      const trainingData = new TestTrainingDataRepository();
      const trainedModel = await new LayersModelTrainer(
        StaticConfiguration.defaultNeuralNetworkSettings,
        () => (iterations += 1),
      ).trainModel(trainingData);
      const model = writable(trainedModel);

      const gestureRepository = new TestGestureRepository();
      gestureRepository.addGesture({
        color: 'blue',
        ID: 1,
        name: 'test',
        output: {},
        recordings: [],
      });
      gestureRepository.addGesture({
        color: 'blue',
        ID: 2,
        name: 'test',
        output: {},
        recordings: [],
      });
      gestureRepository.addGesture({
        color: 'blue',
        ID: 3,
        name: 'test',
        output: {},
        recordings: [],
      });

      const confidences = new Confidences();

      const classifier = new ClassifierFactory().buildClassifier(
        model,
        async () => void 0,
        filters,
        gestureRepository,
        (gestureId, confidence) => confidences.setConfidence(gestureId, confidence),
        new Snackbar(),
      );

      // This is based on known correct results
      await classifier.classify(classifierInput);

      expect(get(confidences).get(1)).toBeCloseTo(0);
      expect(get(confidences).get(2)).toBeCloseTo(0);
      expect(get(confidences).get(3)).toBeCloseTo(1);
    },
    {
      repeats: 20,
      retry: 2,
    },
  );
});

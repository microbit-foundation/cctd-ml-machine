/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { PollingPredictorEngine } from '../../backend/application/PollingPredictorEngine';
import type { ClassifierService } from '../../backend/domain/ClassifierService';
import type { ConfidenceService } from '../../backend/domain/ConfidenceService';
import type { DataService } from '../../backend/domain/DataService';
import type { GestureRepository } from '../../backend/domain/GestureRepository';
import type { PredictionOutput } from '../../core/classifier/PredictionOutput';
import type { NewGesture } from '../../core/entities/NewGesture';
import { Confidences } from '../../core/entities/Confidences';
import BaseVector from '../../core/vector/BaseVector';

const INTERVAL = 100;
const SAMPLE_SIZE = 10;
const SAMPLE_DURATION = 500;

function makeGesture(id: number): NewGesture {
  return {
    getID: () => id,
    getName: () => `gesture-${id}`,
    getOutput: () => ({ requiredConfidence: 0.8 }),
    getRecordings: () => [],
    getValidationRecordings: () => [],
    getColor: () => '#000000',
    setName: vi.fn(),
    setOutput: vi.fn(),
    setRecordings: vi.fn(),
    setValidationRecordings: vi.fn(),
  } as unknown as NewGesture;
}

function makePredictionOutput(values: number[]): PredictionOutput {
  return {
    getPrediction: () => new BaseVector(values),
    getPredcitionByClassIndex: (i: number) => values[i],
    getPredictedIndex: () => values.indexOf(Math.max(...values)),
    getDataIndexLabel: () => ({}) as any,
  };
}

/** Creates an array of `count` BaseVectors, each with 3 components. */
function makeSamples(count: number): BaseVector[] {
  return Array.from({ length: count }, (_, i) => new BaseVector([i, i + 1, i + 2]));
}

function makeEngine(
  overrides: {
    classifierService?: Partial<ClassifierService>;
    dataService?: Partial<DataService>;
    confidenceService?: Partial<ConfidenceService>;
    gestureRepository?: Partial<GestureRepository>;
  } = {},
): {
  engine: PollingPredictorEngine;
  classifierService: ClassifierService;
  dataService: DataService;
  confidenceService: ConfidenceService;
  gestureRepository: GestureRepository;
} {
  const classifierService = {
    getClassifier: vi.fn().mockReturnValue({}),
    predict: vi.fn().mockResolvedValue(makePredictionOutput([0.7, 0.3])),
    setClassifier: vi.fn(),
    unsetClassifier: vi.fn(),
    ...overrides.classifierService,
  } as unknown as ClassifierService;

  const dataService = {
    getLiveData: vi.fn().mockReturnValue(makeSamples(10)),
    getSelectedAxes: vi.fn().mockReturnValue([
      { index: 0, label: 'x' },
      { index: 1, label: 'y' },
    ]),
    getFilters: vi.fn().mockReturnValue([]),
    ...overrides.dataService,
  } as unknown as DataService;

  const confidenceService = {
    setConfidences: vi.fn(),
    getMostConfidentPrediction: vi.fn(),
    ...overrides.confidenceService,
  } as unknown as ConfidenceService;

  const gestureRepository = {
    getGestures: vi.fn().mockReturnValue([makeGesture(1), makeGesture(2)]),
    getGesture: vi.fn(),
    saveGesture: vi.fn(),
    saveGestures: vi.fn(),
    clearGestures: vi.fn(),
    removeGesture: vi.fn(),
    generateGestureId: vi.fn(),
    setSelectedGesture: vi.fn(),
    ...overrides.gestureRepository,
  } as unknown as GestureRepository;

  const engine = new PollingPredictorEngine(
    classifierService,
    dataService,
    confidenceService,
    gestureRepository,
    INTERVAL,
    SAMPLE_SIZE,
    SAMPLE_DURATION,
  );

  return { engine, classifierService, dataService, confidenceService, gestureRepository };
}

describe('PollingPredictorEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('does not poll before start() is called', async () => {
    const { engine, classifierService } = makeEngine();
    await vi.advanceTimersByTimeAsync(INTERVAL * 5);
    expect(classifierService.predict).not.toHaveBeenCalled();
    engine.stop();
  });

  test('polls at the configured interval after start()', async () => {
    const { engine, classifierService } = makeEngine();
    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL * 3);
    expect(classifierService.predict).toHaveBeenCalledTimes(3);
    engine.stop();
  });

  test('stop() halts further polling', async () => {
    const { engine, classifierService } = makeEngine();
    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    engine.stop();
    const callsAfterStop = (classifierService.predict as ReturnType<typeof vi.fn>).mock
      .calls.length;
    await vi.advanceTimersByTimeAsync(INTERVAL * 3);
    expect(classifierService.predict).toHaveBeenCalledTimes(callsAfterStop);
  });

  test('calling start() while already running does not start additional polling', async () => {
    const { engine, classifierService } = makeEngine();
    engine.start();
    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    expect(classifierService.predict).toHaveBeenCalledTimes(1);
    engine.stop();
  });

  test('maps prediction output to a Confidences object keyed by gesture ID', async () => {
    const setConfidencesMock = vi.fn();
    const { engine } = makeEngine({
      confidenceService: { setConfidences: setConfidencesMock },
    });

    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    engine.stop();

    expect(setConfidencesMock).toHaveBeenCalledTimes(1);
    const receivedConfidences: Confidences = setConfidencesMock.mock.calls[0][0];
    expect(receivedConfidences).toBeInstanceOf(Confidences);
    expect(receivedConfidences.getConfidences().get(1)).toBe(0.7);
    expect(receivedConfidences.getConfidences().get(2)).toBe(0.3);
  });

  test('passes the configured sample duration and sample size to getLiveData', async () => {
    const getLiveDataMock = vi.fn().mockReturnValue(makeSamples(10));
    const { engine } = makeEngine({
      dataService: {
        getLiveData: getLiveDataMock,
        getSelectedAxes: vi.fn().mockReturnValue([]),
        getFilters: vi.fn().mockReturnValue([]),
      },
    });

    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    engine.stop();

    expect(getLiveDataMock).toHaveBeenCalledWith(SAMPLE_DURATION, SAMPLE_SIZE);
  });

  test('does not call predict when classifier is undefined', async () => {
    const predictMock = vi.fn();
    const { engine } = makeEngine({
      classifierService: {
        getClassifier: vi.fn().mockReturnValue(undefined),
        predict: predictMock,
      },
    });

    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    engine.stop();

    expect(predictMock).not.toHaveBeenCalled();
  });

  test('does not call predict when live data is empty', async () => {
    const predictMock = vi.fn();
    const { engine } = makeEngine({
      classifierService: {
        getClassifier: vi.fn().mockReturnValue({}),
        predict: predictMock,
      },
      dataService: {
        getLiveData: vi.fn().mockReturnValue([]),
        getSelectedAxes: vi.fn().mockReturnValue([]),
        getFilters: vi.fn().mockReturnValue([]),
      },
    });

    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    engine.stop();

    expect(predictMock).not.toHaveBeenCalled();
  });

  test('does not call predict when live data has fewer than 8 samples', async () => {
    const predictMock = vi.fn();
    const { engine } = makeEngine({
      classifierService: {
        getClassifier: vi.fn().mockReturnValue({}),
        predict: predictMock,
      },
      dataService: {
        getLiveData: vi.fn().mockReturnValue(makeSamples(7)),
        getSelectedAxes: vi.fn().mockReturnValue([]),
        getFilters: vi.fn().mockReturnValue([]),
      },
    });

    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    engine.stop();

    expect(predictMock).not.toHaveBeenCalled();
  });

  test('does call predict when live data has exactly 8 samples', async () => {
    const predictMock = vi.fn().mockResolvedValue(makePredictionOutput([0.6, 0.4]));
    const { engine } = makeEngine({
      classifierService: {
        getClassifier: vi.fn().mockReturnValue({}),
        predict: predictMock,
      },
      dataService: {
        getLiveData: vi.fn().mockReturnValue(makeSamples(8)),
        getSelectedAxes: vi.fn().mockReturnValue([{ index: 0, label: 'x' }]),
        getFilters: vi.fn().mockReturnValue([]),
      },
    });

    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    engine.stop();

    expect(predictMock).toHaveBeenCalledTimes(1);
  });

  test('logs a prediction error warning only once across consecutive failures', async () => {
    const predictMock = vi.fn().mockRejectedValue(new Error('model not ready'));
    const setConfidencesMock = vi.fn();
    const { engine } = makeEngine({
      classifierService: {
        getClassifier: vi.fn().mockReturnValue({}),
        predict: predictMock,
      },
      confidenceService: { setConfidences: setConfidencesMock },
    });

    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL * 5);
    engine.stop();

    // predict was called 5 times but confidences should never be set
    expect(predictMock).toHaveBeenCalledTimes(5);
    expect(setConfidencesMock).not.toHaveBeenCalled();
  });

  test('resets the warning flag so the next error is logged after a successful prediction', async () => {
    let callCount = 0;
    const predictMock = vi.fn().mockImplementation(() => {
      callCount++;
      // Succeed on first call, fail on subsequent calls
      if (callCount === 1) {
        return Promise.resolve(makePredictionOutput([0.9, 0.1]));
      }
      return Promise.reject(new Error('transient error'));
    });

    const setConfidencesMock = vi.fn();
    const { engine } = makeEngine({
      classifierService: {
        getClassifier: vi.fn().mockReturnValue({}),
        predict: predictMock,
      },
      confidenceService: { setConfidences: setConfidencesMock },
    });

    engine.start();
    await vi.advanceTimersByTimeAsync(INTERVAL * 3);
    engine.stop();

    // First call succeeds → setConfidences called once
    expect(setConfidencesMock).toHaveBeenCalledTimes(1);
    // Subsequent calls fail → confidences not called again
    expect(predictMock).toHaveBeenCalledTimes(3);
  });
});

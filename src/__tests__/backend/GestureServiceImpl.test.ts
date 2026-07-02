/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Axis } from '../../core/entities/Axis';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Recording } from '../../core/entities/recording/Recording';
import type { AxisRepository } from '../../backend/domain/AxisRepository';
import type { GestureRepository } from '../../backend/domain/GestureRepository';
import type { ValidationRepository } from '../../backend/domain/ValidationRepository';
import type { SystemColors } from '../../backend/domain/implementation/SystemColors';
import { GestureImpl } from '../../backend/domain/implementation/gesture/GestureImpl';
import { GestureServiceImpl } from '../../backend/domain/implementation/gesture/GestureServiceImpl';

function createRecording(id: number, axes: Axis[] = []): Recording {
  return {
    getId: () => id,
    getAxes: () => axes,
    getSamples: () => [],
  };
}

function createGesture(
  id: number,
  recordings: Recording[] = [],
  validationRecordings: Recording[] = [],
): NewGesture {
  return new GestureImpl(
    id,
    `gesture-${id}`,
    recordings,
    validationRecordings,
    { requiredConfidence: 0.8 },
    '#000000',
  );
}

function createGestureRepository(initialGestures: NewGesture[] = []): GestureRepository {
  let selectedGesture: NewGesture | undefined;
  let nextId = 1000;
  const gestures = [...initialGestures];

  return {
    setSelectedGesture: vi.fn((gesture: NewGesture | undefined) => {
      selectedGesture = gesture;
      return selectedGesture;
    }),
    generateGestureId: vi.fn(() => {
      nextId += 1;
      return nextId;
    }),
    saveGesture: vi.fn((gesture: NewGesture) => {
      const index = gestures.findIndex(current => current.getID() === gesture.getID());
      if (index === -1) {
        gestures.push(gesture);
      } else {
        gestures[index] = gesture;
      }
      return gesture;
    }),
    saveGestures: vi.fn((value: NewGesture[]) => {
      gestures.splice(0, gestures.length, ...value);
      return value;
    }),
    getGestures: vi.fn(() => [...gestures]),
    getGesture: vi.fn((gestureId: number) =>
      gestures.find(gesture => gesture.getID() === gestureId),
    ),
    clearGestures: vi.fn(() => {
      gestures.splice(0, gestures.length);
    }),
    removeGesture: vi.fn((gestureId: number) => {
      const filtered = gestures.filter(gesture => gesture.getID() !== gestureId);
      gestures.splice(0, gestures.length, ...filtered);
    }),
  };
}

describe('GestureServiceImpl', () => {
  let axisRepository: AxisRepository;
  let validationRepository: ValidationRepository;
  let colors: SystemColors;

  beforeEach(() => {
    axisRepository = {
      setAvailableAxes: vi.fn(),
      setSelectedAxes: vi.fn(),
      getAvailableAxes: vi.fn(() => []),
      getSelectedAxes: vi.fn(() => []),
    };
    validationRepository = {
      saveValidationResult: vi.fn(),
      clearValidationResult: vi.fn(),
      getValidationResult: vi.fn(),
    };
    colors = {
      generateGestureColor: vi.fn(() => '#123456'),
    };
  });

  test('createGesture generates id, color and persists the new gesture', () => {
    const gestureRepository = createGestureRepository();
    const service = new GestureServiceImpl(
      gestureRepository,
      colors,
      axisRepository,
      validationRepository,
    );

    const created = service.createGesture('wave');

    expect(created.getName()).toBe('wave');
    expect(created.getID()).toBe(1001);
    expect(created.getOutput().requiredConfidence).toBe(0.8);
    expect(created.getColor()).toBe('#123456');
    expect(created.getRecordings()).toEqual([]);
    expect(created.getValidationRecordings()).toEqual([]);
    expect(gestureRepository.saveGesture).toHaveBeenCalledWith(created);
  });

  test('addRecording and deleteRecording mutate recordings for the target gesture', () => {
    const gesture = createGesture(1, [createRecording(10)]);
    const gestureRepository = createGestureRepository([gesture]);
    const service = new GestureServiceImpl(
      gestureRepository,
      colors,
      axisRepository,
      validationRepository,
    );

    service.addRecording(1, createRecording(11));
    expect(gesture.getRecordings().map(recording => recording.getId())).toEqual([10, 11]);

    service.deleteRecording(1, 10);
    expect(gesture.getRecordings().map(recording => recording.getId())).toEqual([11]);
    expect(gestureRepository.saveGesture).toHaveBeenCalledTimes(2);
  });

  test('addValidationRecording and deleteValidationRecording clear validation state', () => {
    const gesture = createGesture(1, [], [createRecording(100)]);
    const gestureRepository = createGestureRepository([gesture]);
    const service = new GestureServiceImpl(
      gestureRepository,
      colors,
      axisRepository,
      validationRepository,
    );

    service.addValidationRecording(1, createRecording(101));
    service.deleteValidationRecording(1, 100);

    expect(gesture.getValidationRecordings().map(recording => recording.getId())).toEqual(
      [101],
    );
    expect(validationRepository.clearValidationResult).toHaveBeenCalledTimes(2);
    expect(gestureRepository.saveGesture).toHaveBeenCalledTimes(2);
  });

  test('finds gesture by regular and validation recording id', () => {
    const first = createGesture(1, [createRecording(1)], [createRecording(11)]);
    const second = createGesture(2, [createRecording(2)], [createRecording(22)]);
    const gestureRepository = createGestureRepository([first, second]);
    const service = new GestureServiceImpl(
      gestureRepository,
      colors,
      axisRepository,
      validationRepository,
    );

    expect(service.getGestureFromRecording(2)?.getID()).toBe(2);
    expect(service.getGestureFromValidationRecording(11)?.getID()).toBe(1);
    expect(service.getGestureFromRecording(999)).toBeUndefined();
    expect(service.getGestureFromValidationRecording(999)).toBeUndefined();
  });

  test('setGestures updates axis repository from first available recording', () => {
    const axes: Axis[] = [
      { index: 0, label: 'x' },
      { index: 1, label: 'y' },
    ];
    const gestures = [createGesture(1, [createRecording(1, axes)]), createGesture(2, [])];
    const gestureRepository = createGestureRepository();
    const service = new GestureServiceImpl(
      gestureRepository,
      colors,
      axisRepository,
      validationRepository,
    );

    service.setGestures(gestures);

    expect(gestureRepository.saveGestures).toHaveBeenCalledWith(gestures);
    expect(axisRepository.setAvailableAxes).toHaveBeenCalledWith(axes);
    expect(axisRepository.setSelectedAxes).toHaveBeenCalledWith(axes);
  });

  test('setGestures sets empty axes when no recordings exist', () => {
    const gestures = [createGesture(1), createGesture(2)];
    const gestureRepository = createGestureRepository();
    const service = new GestureServiceImpl(
      gestureRepository,
      colors,
      axisRepository,
      validationRepository,
    );

    service.setGestures(gestures);

    expect(axisRepository.setAvailableAxes).toHaveBeenCalledWith([]);
    expect(axisRepository.setSelectedAxes).toHaveBeenCalledWith([]);
  });

  test('throws when mutating a non-existing gesture', () => {
    const gestureRepository = createGestureRepository();
    const service = new GestureServiceImpl(
      gestureRepository,
      colors,
      axisRepository,
      validationRepository,
    );

    expect(() => service.setGestureName(999, 'missing')).toThrow(
      "Couldn't find gesture with id 999",
    );
    expect(() => service.deleteRecording(999, 1)).toThrow(
      "Couldn't find gesture with id 999",
    );
  });
});

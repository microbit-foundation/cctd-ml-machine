/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, test, vi } from 'vitest';
import type { Axis } from '../../core/entities/Axis';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Recording } from '../../core/entities/recording/Recording';
import type { GestureRepository } from '../../backend/domain/GestureRepository';
import type { SelectedAxesListener } from '../../backend/domain/eventlistener/SelectedAxesListener';
import type { AbstractState } from '../../backend/statemanagement/AbstractState';
import type { AbstractStates } from '../../backend/statemanagement/AbstractStates';
import { StatesAxisRepository } from '../../backend/infrastructure/StatesAxisRepository';

function createState<T>(initial: T): AbstractState<T> {
  let value = initial;
  return {
    get: () => value,
    set: (next: T) => {
      value = next;
    },
    update: (updater: (currentValue: T) => T) => {
      value = updater(value);
    },
    readOnly: () => ({
      get: () => value,
      subscribe: () => () => {},
    }),
    subscribe: () => () => {},
  };
}

function createRecording(id: number, axes: Axis[]): Recording {
  return {
    getId: () => id,
    getAxes: () => axes,
    getSamples: () => [],
  };
}

function createGesture(id: number, recordings: Recording[]): NewGesture {
  return {
    getID: () => id,
    getName: () => `gesture-${id}`,
    getOutput: () => ({ requiredConfidence: 0.8 }),
    getRecordings: () => recordings,
    getValidationRecordings: () => [],
    getColor: () => '#000000',
    setName: vi.fn(),
    setOutput: vi.fn(),
    setRecordings: vi.fn(),
    setValidationRecordings: vi.fn(),
  } as NewGesture;
}

function createStates(
  availableAxes: Axis[],
  selectedAxes: Axis[],
): {
  states: AbstractStates;
  availableState: AbstractState<Axis[]>;
  selectedState: AbstractState<Axis[]>;
} {
  const availableState = createState<Axis[]>(availableAxes);
  const selectedState = createState<Axis[]>(selectedAxes);
  const states = {
    getAvailableAxes: () => availableState,
    getSelectedAxes: () => selectedState,
  } as AbstractStates;
  return { states, availableState, selectedState };
}

describe('StatesAxisRepository', () => {
  test('constructor initializes available and selected axes from first recording', () => {
    const expectedAxes: Axis[] = [
      { index: 0, label: 'x' },
      { index: 1, label: 'y' },
    ];
    const gestureRepository = {
      getGestures: () => [createGesture(1, [createRecording(10, expectedAxes)])],
    } as GestureRepository;
    const { states, availableState, selectedState } = createStates([], []);

    const repository = new StatesAxisRepository(gestureRepository, states);

    expect(repository.getAvailableAxes()).toEqual(expectedAxes);
    expect(repository.getSelectedAxes()).toEqual(expectedAxes);
    expect(availableState.get()).toEqual(expectedAxes);
    expect(selectedState.get()).toEqual(expectedAxes);
  });

  test('constructor does not overwrite existing axes in state', () => {
    const existingAvailable: Axis[] = [{ index: 2, label: 'z' }];
    const existingSelected: Axis[] = [{ index: 1, label: 'y' }];
    const gestureRepository = {
      getGestures: () => [
        createGesture(1, [createRecording(10, [{ index: 0, label: 'x' }])]),
      ],
    } as GestureRepository;
    const { states } = createStates(existingAvailable, existingSelected);

    const repository = new StatesAxisRepository(gestureRepository, states);

    expect(repository.getAvailableAxes()).toEqual(existingAvailable);
    expect(repository.getSelectedAxes()).toEqual(existingSelected);
  });

  test('setSelectedAxes updates state and notifies listeners', () => {
    const listener: SelectedAxesListener = {
      onSelectedAxesChanged: vi.fn(),
    };
    const gestureRepository = {
      getGestures: () => [],
    } as unknown as GestureRepository;
    const { states, selectedState } = createStates([], []);
    const repository = new StatesAxisRepository(gestureRepository, states, [listener]);
    const nextAxes: Axis[] = [{ index: 0, label: 'x' }];

    repository.setSelectedAxes(nextAxes);

    expect(selectedState.get()).toEqual(nextAxes);
    expect(listener.onSelectedAxesChanged).toHaveBeenCalledWith(nextAxes);
  });

  test('setAvailableAxes updates available axes state', () => {
    const gestureRepository = {
      getGestures: () => [],
    } as unknown as GestureRepository;
    const { states, availableState } = createStates([], []);
    const repository = new StatesAxisRepository(gestureRepository, states);
    const availableAxes: Axis[] = [{ index: 2, label: 'z' }];

    repository.setAvailableAxes(availableAxes);

    expect(availableState.get()).toEqual(availableAxes);
    expect(repository.getAvailableAxes()).toEqual(availableAxes);
  });
});

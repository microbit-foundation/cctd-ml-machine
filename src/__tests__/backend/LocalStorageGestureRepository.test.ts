/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { AbstractState } from '../../backend/statemanagement/AbstractState';
import type { GestureListListener } from '../../backend/domain/eventlistener/GestureListListener';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Axis } from '../../core/entities/Axis';
import type { Logger } from '../../core/logging/Logger';
import { RecordingImpl } from '../../core/entities/recording/RecordingImpl';
import { Sample } from '../../core/entities/recording/Sample';
import { GestureImpl } from '../../backend/domain/implementation/gesture/GestureImpl';
import { LocalStorageGestureRepository } from '../../backend/infrastructure/LocalStorageGestureRepository';
import ControlledStorage from '../../lib/ControlledStorage';

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

function createGesture(
  id: number,
  name = `gesture-${id}`,
  axes: Axis[] = [],
): NewGesture {
  const recording = new RecordingImpl(id * 10, [new Sample([1, 2, 3])], axes);
  return new GestureImpl(
    id,
    name,
    [recording],
    [],
    { requiredConfidence: 0.8 },
    '#ff0000',
  );
}

describe('LocalStorageGestureRepository', () => {
  let logger: Logger;
  let listener: GestureListListener;
  let selectedGestureState: AbstractState<NewGesture | undefined>;

  beforeEach(() => {
    if (!globalThis.localStorage) {
      let storage = new Map<string, string>();
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: (key: string) => storage.get(key) ?? null,
          setItem: (key: string, value: string) => {
            storage.set(key, value);
          },
          removeItem: (key: string) => {
            storage.delete(key);
          },
          clear: () => {
            storage = new Map<string, string>();
          },
        },
        configurable: true,
      });
    }
    globalThis.localStorage.clear();
    globalThis.localStorage.setItem(
      'gestureData',
      JSON.stringify({ version: ControlledStorage.localStorageVersion, value: [] }),
    );
    vi.restoreAllMocks();
    logger = {
      info: vi.fn(),
      warn: vi.fn(),
    };
    listener = {
      onGesturesChanged: vi.fn(),
    };
    selectedGestureState = createState<NewGesture | undefined>(undefined);
  });

  test('saveGestures persists gestures and notifies listeners', () => {
    const repository = new LocalStorageGestureRepository(
      logger,
      [listener],
      selectedGestureState,
    );
    const first = createGesture(1);
    const second = createGesture(2);

    repository.saveGestures([first, second]);

    const persisted = repository.getGestures();
    expect(persisted.map(gesture => gesture.getID())).toEqual([1, 2]);
    expect(
      (listener.onGesturesChanged as ReturnType<typeof vi.fn>).mock.calls,
    ).toHaveLength(1);
    expect(repository.getGesture(2)?.getName()).toBe('gesture-2');
  });

  test('saveGesture updates an existing gesture instead of duplicating it', () => {
    const repository = new LocalStorageGestureRepository(
      logger,
      [],
      selectedGestureState,
    );
    repository.saveGesture(createGesture(1, 'old-name'));

    repository.saveGesture(createGesture(1, 'new-name'));

    const gestures = repository.getGestures();
    expect(gestures).toHaveLength(1);
    expect(gestures[0].getName()).toBe('new-name');
  });

  test('setSelectedGesture delegates to selected gesture state', () => {
    const repository = new LocalStorageGestureRepository(
      logger,
      [],
      selectedGestureState,
    );
    const gesture = createGesture(3);

    repository.setSelectedGesture(gesture);

    expect(selectedGestureState.get()?.getID()).toBe(3);
  });

  test('getGesture warns and returns undefined for unknown id', () => {
    const repository = new LocalStorageGestureRepository(
      logger,
      [],
      selectedGestureState,
    );

    const result = repository.getGesture(12345);

    expect(result).toBeUndefined();
    expect(logger.warn).toHaveBeenCalledWith(
      "Couldn't find any gestures with gesture id 12345",
    );
  });

  test('generateGestureId increments when proposed id already exists', () => {
    const repository = new LocalStorageGestureRepository(
      logger,
      [],
      selectedGestureState,
    );
    repository.saveGesture(createGesture(100));
    vi.spyOn(Date.prototype, 'getTime').mockReturnValue(100);

    const generated = repository.generateGestureId();

    expect(generated).toBe(101);
  });

  test('removeGesture and clearGestures remove persisted data', () => {
    const repository = new LocalStorageGestureRepository(
      logger,
      [],
      selectedGestureState,
    );
    repository.saveGestures([createGesture(1), createGesture(2)]);

    repository.removeGesture(1);
    expect(repository.getGestures().map(gesture => gesture.getID())).toEqual([2]);

    repository.clearGestures();
    expect(repository.getGestures()).toEqual([]);
  });

  test('getAxesFromGestures returns axes from the first recording only', () => {
    const axes: Axis[] = [
      { index: 0, label: 'x' },
      { index: 1, label: 'y' },
    ];
    const repository = new LocalStorageGestureRepository(
      logger,
      [],
      selectedGestureState,
    );
    repository.saveGestures([
      createGesture(1, 'first', axes),
      createGesture(2, 'second', [{ index: 2, label: 'z' }]),
    ]);

    expect(repository.getAxesFromGestures()).toEqual(axes);
  });
});

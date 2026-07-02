/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, test } from 'vitest';
import type { AbstractState } from '../../backend/statemanagement/AbstractState';
import type { AbstractStates } from '../../backend/statemanagement/AbstractStates';
import type { ValidationResult } from '../../backend/domain/implementation/validation/ValidationResult';
import { StatesValidationRepository } from '../../backend/infrastructure/StatesValidationRepository';

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

describe('StatesValidationRepository', () => {
  test('saves and returns the validation result from state', () => {
    const validationState = createState<ValidationResult | undefined>(undefined);
    const autoUpdateState = createState(false);
    const states = {
      getValidationResult: () => validationState,
      getValidationAutoUpdate: () => autoUpdateState,
    } as AbstractStates;
    const repository = new StatesValidationRepository(states);
    const result = {
      confusionMatrix: {
        getCategories: () => ['a'],
      },
    } as unknown as ValidationResult;

    repository.saveValidationResult(result);

    expect(repository.getValidationResult()).toBe(result);
  });

  test('clearValidationResult removes stored value', () => {
    const existing = {
      confusionMatrix: {
        getCategories: () => ['x'],
      },
    } as unknown as ValidationResult;
    const validationState = createState<ValidationResult | undefined>(existing);
    const autoUpdateState = createState(false);
    const states = {
      getValidationResult: () => validationState,
      getValidationAutoUpdate: () => autoUpdateState,
    } as AbstractStates;
    const repository = new StatesValidationRepository(states);

    repository.clearValidationResult();

    expect(repository.getValidationResult()).toBeUndefined();
  });

  test('setAutoUpdate stores value in auto update state', () => {
    const validationState = createState<ValidationResult | undefined>(undefined);
    const autoUpdateState = createState(false);
    const states = {
      getValidationResult: () => validationState,
      getValidationAutoUpdate: () => autoUpdateState,
    } as AbstractStates;
    const repository = new StatesValidationRepository(states);

    repository.setAutoUpdate(true);

    expect(autoUpdateState.get()).toBe(true);
  });

  test('getAutoUpdate returns value from auto update state', () => {
    const validationState = createState<ValidationResult | undefined>(undefined);
    const autoUpdateState = createState(true);
    const states = {
      getValidationResult: () => validationState,
      getValidationAutoUpdate: () => autoUpdateState,
    } as AbstractStates;
    const repository = new StatesValidationRepository(states);

    expect(repository.getAutoUpdate()).toBe(true);
  });
});

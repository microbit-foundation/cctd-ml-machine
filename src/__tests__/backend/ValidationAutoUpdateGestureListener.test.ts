/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, test, vi } from 'vitest';
import type { ValidationRepository } from '../../backend/domain/ValidationRepository';
import type { ValidationService } from '../../backend/domain/ValidationService';
import { ValidationAutoUpdateGestureListener } from '../../backend/interface-listener/ValidationAutoUpdateGestureListener';

describe('ValidationAutoUpdateGestureListener', () => {
  test('does nothing before dependencies are configured', () => {
    const listener = new ValidationAutoUpdateGestureListener();

    expect(() => listener.onGesturesChanged([])).not.toThrow();
  });

  test('does not evaluate when auto update is disabled', () => {
    const validationService: ValidationService = {
      evaluateValidationSet: vi.fn(async () => undefined),
      clearValidationResult: vi.fn(),
      setAutoUpdate: vi.fn(),
    };
    const validationRepository: ValidationRepository = {
      saveValidationResult: vi.fn(),
      clearValidationResult: vi.fn(),
      getValidationResult: vi.fn(),
      getAutoUpdate: vi.fn(() => false),
      setAutoUpdate: vi.fn(),
    };
    const listener = new ValidationAutoUpdateGestureListener();
    listener.setValidationDependencies(validationService, validationRepository);

    listener.onGesturesChanged([]);

    expect(validationService.evaluateValidationSet).not.toHaveBeenCalled();
  });

  test('evaluates validation set when auto update is enabled', async () => {
    const validationService: ValidationService = {
      evaluateValidationSet: vi.fn(async () => undefined),
      clearValidationResult: vi.fn(),
      setAutoUpdate: vi.fn(),
    };
    const validationRepository: ValidationRepository = {
      saveValidationResult: vi.fn(),
      clearValidationResult: vi.fn(),
      getValidationResult: vi.fn(),
      getAutoUpdate: vi.fn(() => true),
      setAutoUpdate: vi.fn(),
    };
    const listener = new ValidationAutoUpdateGestureListener();
    listener.setValidationDependencies(validationService, validationRepository);

    listener.onGesturesChanged([]);
    await Promise.resolve();

    expect(validationService.evaluateValidationSet).toHaveBeenCalledTimes(1);
  });
});

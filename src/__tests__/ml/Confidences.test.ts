/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { describe, expect, test, vi } from 'vitest';
import { Confidences } from '../../core/entities/Confidences';
import type { NewGesture } from '../../core/entities/NewGesture';

function makeGesture(id: number, requiredConfidence: number): NewGesture {
  return {
    getID: () => id,
    getName: () => `gesture-${id}`,
    getOutput: () => ({ requiredConfidence }),
    getRecordings: () => [],
    getValidationRecordings: () => [],
    getColor: () => '#000000',
    setName: vi.fn(),
    setOutput: vi.fn(),
    setRecordings: vi.fn(),
    setValidationRecordings: vi.fn(),
  } as unknown as NewGesture;
}

describe('Confidences', () => {
  test('getConfidences returns the full confidence map', () => {
    const map = new Map([[1, 0.9]]);
    const confidences = new Confidences(map);
    expect(confidences.getConfidences()).toBe(map);
  });

  test('getConfidence returns the confidence value for a known gesture', () => {
    const gesture = makeGesture(1, 0.8);
    const confidences = new Confidences(new Map([[1, 0.75]]));
    expect(confidences.getConfidence(gesture)).toBe(0.75);
  });

  test('getConfidence returns undefined for an unknown gesture', () => {
    const gesture = makeGesture(99, 0.8);
    const confidences = new Confidences(new Map([[1, 0.75]]));
    expect(confidences.getConfidence(gesture)).toBeUndefined();
  });

  test('setConfidence updates the confidence for a gesture', () => {
    const gesture = makeGesture(1, 0.8);
    const confidences = new Confidences(new Map([[1, 0.5]]));
    confidences.setConfidence(1, 0.95);
    expect(confidences.getConfidence(gesture)).toBe(0.95);
  });

  test('setConfidence adds an entry for a new gesture ID', () => {
    const confidences = new Confidences(new Map());
    confidences.setConfidence(2, 0.6);
    expect(confidences.getConfidences().get(2)).toBe(0.6);
  });

  test('isConfident returns true when confidence meets the required threshold', () => {
    const gesture = makeGesture(1, 0.8);
    const confidences = new Confidences(new Map([[1, 0.8]]));
    expect(confidences.isConfident(gesture)).toBe(true);
  });

  test('isConfident returns true when confidence exceeds the required threshold', () => {
    const gesture = makeGesture(1, 0.8);
    const confidences = new Confidences(new Map([[1, 0.95]]));
    expect(confidences.isConfident(gesture)).toBe(true);
  });

  test('isConfident returns false when confidence is below the required threshold', () => {
    const gesture = makeGesture(1, 0.8);
    const confidences = new Confidences(new Map([[1, 0.5]]));
    expect(confidences.isConfident(gesture)).toBe(false);
  });

  test('isConfident returns false when the gesture has no confidence value', () => {
    const gesture = makeGesture(99, 0.8);
    const confidences = new Confidences(new Map([[1, 0.9]]));
    expect(confidences.isConfident(gesture)).toBe(false);
  });

  test('getMostConfidentGestureID returns the ID with the highest confidence', () => {
    const confidences = new Confidences(
      new Map([
        [1, 0.3],
        [2, 0.9],
        [3, 0.6],
      ]),
    );
    expect(confidences.getMostConfidentGestureID()).toBe(2);
  });

  test('getMostConfidentGestureID returns undefined for an empty confidence map', () => {
    const confidences = new Confidences(new Map());
    expect(confidences.getMostConfidentGestureID()).toBeUndefined();
  });

  test('getMostConfidentGestureID returns the only ID when there is one entry', () => {
    const confidences = new Confidences(new Map([[5, 0.42]]));
    expect(confidences.getMostConfidentGestureID()).toBe(5);
  });
});

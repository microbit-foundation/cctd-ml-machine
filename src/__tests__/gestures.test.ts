/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { gestures } from '../script/stores/Stores';

describe('Tests of Gestures', () => {
  test('Creating gesture does not throw', () => {
    expect(() => {
      gestures.createGesture('test');
    }).not.toThrow();
  });

  test('Can get gesture after creation', () => {
    const gestureName = 'test1234';
    const gesture = gestures.createGesture(gestureName);
    const fetchedGesture = gestures.getGesture(gesture.getId());
    expect(gestureName).toBe(fetchedGesture.getName());
  });
});

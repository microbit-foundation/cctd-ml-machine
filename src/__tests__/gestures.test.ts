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
  beforeEach(() => {
    gestures.clearGestures();
  });
  test('Creating gesture does not throw', () => {
    expect(() => {
      gestures.createGesture('test');
    }).not.toThrow();
  });

  test('Creating 2 gestures makes total number of gesture 2', () => {
    gestures.createGesture('Gesture1');
    gestures.createGesture('Gesture2');

    expect(gestures.getGestures().length).toBe(2);
  });

  test('Can get gesture after creation', () => {
    const gestureName = 'test1234';
    const gesture = gestures.createGesture(gestureName);
    const fetchedGesture = gestures.getGesture(gesture.getId());
    expect(fetchedGesture.getName()).toBe(gestureName);
  });

  test('Clearing gestures clears gestures', () => {
    gestures.createGesture('gestureName');
    gestures.createGesture('gestureName');

    gestures.clearGestures();

    expect(gestures.getGestures().length).toBe(0);
  });
});

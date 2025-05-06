/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { stores } from '../../lib/stores/Stores';

describe('Tests of Gestures', () => {
  beforeEach(() => {
    stores.getGestures().clearGestures();
  });
  test('Creating gesture does not throw', () => {
    expect(() => {
      stores.getGestures().createGesture('test');
    }).not.toThrow();
  });

  test('Creating 2 gestures makes total number of gesture 2', () => {
    stores.getGestures().createGesture('Gesture1');
    stores.getGestures().createGesture('Gesture2');

    expect(stores.getGestures().getGestures().length).toBe(2);
  });

  test('Can get gesture after creation', () => {
    const gestureName = 'test1234';
    const gesture = stores.getGestures().createGesture(gestureName);
    const fetchedGesture = stores.getGestures().getGesture(gesture.getId());
    expect(fetchedGesture.getName()).toBe(gestureName);
  });

  test('Clearing gestures clears gestures', () => {
    stores.getGestures().createGesture('gestureName');
    stores.getGestures().createGesture('gestureName');

    stores.getGestures().clearGestures();

    expect(stores.getGestures().getGestures().length).toBe(0);
  });
});

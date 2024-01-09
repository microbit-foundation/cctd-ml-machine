/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { classifier, gestures } from '../script/stores/Stores';
import TestMLModelTrainer from './mocks/mlmodel/TestMLModelTrainer';

describe('Classifier tests', () => {
  test('Changing matrix does not mark model as untrained', async () => {
    const gesture = gestures.createGesture('some gesture');
    gestures.createGesture('some gesture2');
    await classifier.getModel().train(new TestMLModelTrainer(2));

    gesture.setLEDOutput(new Array(25).fill(false) as boolean[]);
    expect(classifier.getModel().isTrained()).toBe(true);
  });

  test('Adding gesture marks model as untrained', async () => {
    gestures.createGesture('some gesture');
    gestures.createGesture('some gesture2');
    await classifier.getModel().train(new TestMLModelTrainer(2));

    gestures.createGesture('Added gesture');

    expect(classifier.getModel().isTrained()).toBe(false);
  });

  test('Removing gesture marks model as untrained', async () => {
    gestures.createGesture('some gesture');
    gestures.createGesture('some gesture2');
    const gesture3 = gestures.createGesture('some gesture2');
    await classifier.getModel().train(new TestMLModelTrainer(2));

    gestures.removeGesture(gesture3.getId());

    expect(classifier.getModel().isTrained()).toBe(false);
  });
});

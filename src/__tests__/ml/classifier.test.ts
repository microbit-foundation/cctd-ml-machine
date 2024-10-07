/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { stores } from '../../script/stores/Stores';
import TestMLModelTrainer from '../mocks/mlmodel/TestMLModelTrainer';

describe('Classifier tests', () => {
  test('Changing matrix does not mark model as untrained', async () => {
    const gesture = stores.getGestures().createGesture('some gesture');
    stores.getGestures().createGesture('some gesture2');
    await stores.getClassifier().getModel().train(new TestMLModelTrainer(2));

    gesture.setLEDOutput(new Array(25).fill(false) as boolean[]);
    expect(stores.getClassifier().getModel().isTrained()).toBe(true);
  });

  test('Adding gesture marks model as untrained', async () => {
    stores.getGestures().createGesture('some gesture');
    stores.getGestures().createGesture('some gesture2');
    await stores.getClassifier().getModel().train(new TestMLModelTrainer(2));

    stores.getGestures().createGesture('Added gesture');

    expect(stores.getClassifier().getModel().isTrained()).toBe(false);
  });

  test('Removing gesture marks model as untrained', async () => {
    stores.getGestures().createGesture('some gesture');
    stores.getGestures().createGesture('some gesture2');
    const gesture3 = stores.getGestures().createGesture('some gesture2');
    await stores.getClassifier().getModel().train(new TestMLModelTrainer(2));

    stores.getGestures().removeGesture(gesture3.getId());

    expect(stores.getClassifier().getModel().isTrained()).toBe(false);
  });
});

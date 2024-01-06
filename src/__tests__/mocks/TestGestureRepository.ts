/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { Subscriber, Invalidator, Unsubscriber } from 'svelte/store';
import Gesture from '../../script/domain/Gesture';
import GestureRepository from '../../script/domain/GestureRepository';
import { PersistantGestureData } from '../../script/domain/Gestures';
import LocalStorageGestureRepository from '../../script/repository/LocalStorageGestureRepository';
import LocalStorageClassifierRepository from '../../script/repository/LocalStorageClassifierRepository';

/**
 * Test double for gesture repository (Might not be used, remove if its the case)
 */
class TestGestureRepository implements GestureRepository {
  constructor() {
    //const classifierRepository = new ClassifierRepository();
    //new LocalStorageGestureRepository(classifierRepository);
  }

  getGesture(gestureId: number): Gesture {
    throw new Error('Method not implemented.');
  }
  clearGestures(): void {
    throw new Error('Method not implemented.');
  }
  addGesture(gestureData: PersistantGestureData): Gesture {
    throw new Error('Method not implemented.');
  }
  removeGesture(gestureId: number): void {
    throw new Error('Method not implemented.');
  }
  subscribe(
    this: void,
    run: Subscriber<Gesture[]>,
    invalidate?: Invalidator<Gesture[]> | undefined,
  ): Unsubscriber {
    throw new Error('Method not implemented.');
  }
}

export default TestGestureRepository;

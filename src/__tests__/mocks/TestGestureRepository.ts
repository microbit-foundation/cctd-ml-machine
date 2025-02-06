/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  type Subscriber,
  type Invalidator,
  type Unsubscriber,
  writable,
  get,
} from 'svelte/store';
import type { GestureRepository } from '../../script/domain/GestureRepository';
import Gesture from '../../script/domain/stores/gesture/Gesture';
import type { PersistantGestureData } from '../../script/domain/stores/gesture/Gestures';
import GestureConfidence from '../../script/domain/stores/gesture/GestureConfidence';

class TestGestureRepository implements GestureRepository {
  private gestures = writable<Gesture[]>([]);

  getGesture(gestureId: number): Gesture {
    const foundGesture = get(this.gestures).find(g => g.getId() === gestureId);
    if (!foundGesture) {
      throw new Error('Could not find gesture with id ' + gestureId);
    }
    return foundGesture;
  }

  clearGestures(): void {
    this.gestures.set([]);
  }

  addGesture(gestureData: PersistantGestureData): Gesture {
    const gesture = new Gesture(
      writable(gestureData),
      new GestureConfidence(0.5, writable(0)),
      () => void 0,
    );
    this.gestures.update(s => {
      return [...s, gesture];
    });
    return gesture;
  }

  removeGesture(gestureId: number): void {
    this.gestures.update(s => {
      return s.filter(g => g.getId() !== gestureId);
    });
  }

  subscribe(
    run: Subscriber<Gesture[]>,
    invalidate?: Invalidator<Gesture[]> | undefined,
  ): Unsubscriber {
    return this.gestures.subscribe(run, invalidate);
  }
}

export default TestGestureRepository;

/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
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
import type { GestureRepository } from '../../lib/domain/GestureRepository';
import GestureState from '../../lib/domain/stores/gesture/GestureState';
import type { PersistedGestureData } from '../../lib/domain/stores/gesture/Gestures';
import GestureConfidence from '../../lib/domain/stores/gesture/GestureConfidence';

class TestGestureRepository implements GestureRepository {
  private gestures = writable<GestureState[]>([]);

  getGesture(gestureId: number): GestureState {
    const foundGesture = get(this.gestures).find(g => g.getId() === gestureId);
    if (!foundGesture) {
      throw new Error('Could not find gesture with id ' + gestureId);
    }
    return foundGesture;
  }

  clearGestures(): void {
    this.gestures.set([]);
  }

  addGesture(gestureData: PersistedGestureData): GestureState {
    const gesture = new GestureState(
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
    run: Subscriber<GestureState[]>,
    invalidate?: Invalidator<GestureState[]> | undefined,
  ): Unsubscriber {
    return this.gestures.subscribe(run, invalidate);
  }
}

export default TestGestureRepository;

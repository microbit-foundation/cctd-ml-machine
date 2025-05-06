/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type Readable } from 'svelte/store';
import Gesture from './stores/gesture/Gesture';
import { type PersistedGestureData } from './stores/gesture/Gestures';

export interface GestureRepository extends Readable<Gesture[]> {
  getGesture(gestureId: number): Gesture;

  clearGestures(): void;

  addGesture(gestureData: PersistedGestureData): Gesture;

  removeGesture(gestureId: number): void;
}

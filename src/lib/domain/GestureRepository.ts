/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type Readable } from 'svelte/store';
import GestureState from './stores/gesture/GestureState';
import { type PersistedGestureData } from './stores/gesture/Gestures';

export interface GestureRepository extends Readable<GestureState[]> {
  getGesture(gestureId: number): GestureState;

  clearGestures(): void;

  addGesture(gestureData: PersistedGestureData): GestureState;

  removeGesture(gestureId: number): void;
}

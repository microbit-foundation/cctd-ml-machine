/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable } from 'svelte/store';
import Gesture from './stores/gesture/Gesture';
import { PersistantGestureData } from './stores/gesture/Gestures';

interface GestureRepository extends Readable<Gesture[]> {
  getGesture(gestureId: number): Gesture;

  clearGestures(): void;

  addGesture(gestureData: PersistantGestureData): Gesture;

  removeGesture(gestureId: number): void;
}

export default GestureRepository;

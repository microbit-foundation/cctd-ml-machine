/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { GestureID } from '../../core/entities/Gesture';
import type { NewGesture } from '../../core/entities/NewGesture';

export interface GestureRepository {
  setSelectedGesture(gesture: NewGesture | undefined): unknown;

  generateGestureId(): GestureID;

  saveGesture(gesture: NewGesture): NewGesture;

  saveGestures(value: NewGesture[]): NewGesture[];

  getGestures(): NewGesture[];

  getGesture(gestureId: number): NewGesture | undefined;

  clearGestures(): void;

  removeGesture(gestureId: number): void;

  /**
   * Subscribe to gesture change events. The listener is called whenever gestures are saved or removed.
   * Returns an unsubscribe function.
   */
  subscribe(listener: (gestures: NewGesture[]) => void): () => void;
}

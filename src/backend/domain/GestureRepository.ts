/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Gesture, GestureID } from "../../core/entities/Gesture";


export interface GestureRepository {

  generateGestureId(): GestureID;

  saveGesture(gesture: Gesture): Gesture;

  saveGestures(value: Gesture[]): Gesture[];

  getGestures(): Gesture[]

  getGesture(gestureId: number): Gesture | undefined;

  clearGestures(): void;

  removeGesture(gestureId: number): void;
}

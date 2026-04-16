/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { GestureID } from '../../core/entities/Gesture';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Recording } from '../../core/entities/recording/Recording';
import type { Vector } from '../../core/vector/Vector';

export interface GestureService {
  deleteValidationRecording(gestureId: number, recordingId: number): void;
  getGestureFromRecording(recordingId: number): NewGesture | undefined;
  saveGesture(gesture: NewGesture): void;
  saveGestures(gestures: NewGesture[]): void;
  createGesture(name: string): NewGesture;
  deleteRecording(gestureId: GestureID, recordingId: number): void;
  addRecording(gestureId: GestureID, recording: Recording): void;
  deleteGesture(gestureId: GestureID): void;
  setGestureName(gesture: GestureID, name: string): void;
  getGesture(id: GestureID): NewGesture | undefined;
  setGestures(value: NewGesture[]): void;
  getGestures(): NewGesture[];
}

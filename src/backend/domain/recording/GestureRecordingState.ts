/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { NewGesture } from '../../../core/entities/NewGesture';

export class GestureRecordingState {
  constructor(
    private recording: boolean,
    private recordingGesture: NewGesture | undefined,
  ) {}

  setRecordingGesture(gesture: NewGesture | undefined) {
    this.recordingGesture = gesture;
  }

  setRecording(recording: boolean) {
    this.recording = recording;
  }

  isRecording(): boolean {
    return this.recording;
  }

  getRecordingGesture(): NewGesture | undefined {
    return this.recordingGesture;
  }
}

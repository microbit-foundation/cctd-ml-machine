/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { GestureRecordingState } from './recording/GestureRecordingState';

export interface RecordingStateRepository {
  getRecordingState(): GestureRecordingState;
  setRecordingState(state: GestureRecordingState): void;
}

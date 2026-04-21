import type { GestureRecordingState } from './recording/GestureRecordingState';

export interface RecordingStateRepository {
  getRecordingState(): GestureRecordingState;
  setRecordingState(state: GestureRecordingState): void;
}

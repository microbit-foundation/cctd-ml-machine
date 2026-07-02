/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { GestureRecordingState } from '../domain/recording/GestureRecordingState';
import type { RecordingStateRepository } from '../domain/RecordingStateRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesRecordingStateRepository implements RecordingStateRepository {
  constructor(private states: AbstractStates) {}
  getRecordingState(): GestureRecordingState {
    return this.states.getRecordingState().get();
  }
  setRecordingState(state: GestureRecordingState): void {
    this.states.getRecordingState().set(state);
  }
}

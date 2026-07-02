/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Recording } from '../../core/entities/recording/Recording';
import type { GestureRecordingState } from '../domain/recording/GestureRecordingState';
import type { RecordingSettings } from '../domain/recording/RecordingSettings';
import type { RecordingService } from '../domain/RecordingService';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class RecordingController {
  constructor(
    private recordingService: RecordingService,
    private states: AbstractStates,
  ) {}

  public startRecording(gesture: NewGesture): Promise<Recording> {
    return this.recordingService.recordDataExample(gesture);
  }

  public startValidationRecording(gesture: NewGesture): Promise<Recording> {
    return this.recordingService.recordValidationExample(gesture);
  }

  public getRecordingState(): AbstractState<GestureRecordingState> {
    return this.states.getRecordingState();
  }

  public getRecordingSettings(): AbstractState<RecordingSettings> {
    return this.states.getRecordingSettings();
  }
}

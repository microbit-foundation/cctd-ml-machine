/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Axis } from '../../../core/entities/Axis';
import type { NewGesture } from '../../../core/entities/NewGesture';
import type { Recording } from '../../../core/entities/recording/Recording';
import { RecordingImpl } from '../../../core/entities/recording/RecordingImpl';
import { Sample } from '../../../core/entities/recording/Sample';
import type { LiveDataVector } from '../../../core/vector/LiveDataVector';
import type { DataService } from '../DataService';
import type { GestureService } from '../GestureService';
import type { RecordingSettings } from '../recording/RecordingSettings';
import type { RecordingService } from '../RecordingService';
import type { RecordingSettingsRepository } from '../RecordingSettingsRepository';
import type { RecordingStateRepository } from '../RecordingStateRepository';

export class RecordingServiceImpl implements RecordingService {
  constructor(
    private recordingStateRepository: RecordingStateRepository,
    private recordingSettingsRepository: RecordingSettingsRepository,
    private gestureService: GestureService,
    private dataService: DataService,
  ) {}

  async recordValidationExample(gesture: NewGesture): Promise<Recording> {
    return this.performRecording(gesture, recording => {
      this.gestureService.addValidationRecording(gesture.getID(), recording);
    });
  }

  async recordDataExample(gesture: NewGesture): Promise<Recording> {
    return this.performRecording(gesture, recording => {
      this.gestureService.addRecording(gesture.getID(), recording);
    });
  }

  private async performRecording(
    gesture: NewGesture,
    onRecorded: (recording: Recording) => void,
  ): Promise<Recording> {
    const settings = this.recordingSettingsRepository.getRecordingSettings();

    if (this.isRecording()) {
      throw new Error('Already recording');
    }

    this.setRecordingState(true, gesture);

    try {
      await new Promise(resolve => setTimeout(resolve, settings.getRecordingDuration()));
      const recording = this.createRecordingFromBufferedData(gesture);
      onRecorded(recording);
      return recording;
    } finally {
      this.clearRecordingState();
    }
  }

  isRecording(): boolean {
    return this.recordingStateRepository.getRecordingState().isRecording();
  }

  recordingGesture(): NewGesture | undefined {
    return this.recordingStateRepository.getRecordingState().getRecordingGesture();
  }

  private setRecordingState(isRecording: boolean, gesture?: NewGesture) {
    const state = this.recordingStateRepository.getRecordingState();
    state.setRecording(isRecording);
    state.setRecordingGesture(gesture);
    this.recordingStateRepository.setRecordingState(state);
  }

  private clearRecordingState() {
    const state = this.recordingStateRepository.getRecordingState();
    state.setRecording(false);
    state.setRecordingGesture(undefined);
    this.recordingStateRepository.setRecordingState(state);
  }

  private createRecordingFromBufferedData(gesture: NewGesture) {
    const recordingRaw = this.getBufferedRecordingData(
      this.recordingSettingsRepository.getRecordingSettings(),
    );
    const axes = recordingRaw[0]
      .getLabels()
      .map((label, index) => ({ label, index }) as Axis);
    const samples = recordingRaw.map(rawSampleVector => {
      return new Sample(rawSampleVector);
    });

    return new RecordingImpl(Date.now(), samples, axes);
  }

  private getBufferedRecordingData(settings: RecordingSettings): LiveDataVector[] {
    const recordingRaw = this.dataService.getLiveData(
      settings.getRecordingDuration(),
      settings.getMinNoOfSamples(),
    );
    if (recordingRaw.length === 0) {
      throw new Error('No data recorded');
    }
    return recordingRaw;
  }
}

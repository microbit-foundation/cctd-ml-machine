/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  get,
  writable,
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import type { RecordingData } from '../../../core/entities/RecordingData';
import { startRecording as _startRecording } from '../../utils/Recording';
import ConsoleLogger from '../../../core/logging/ConsoleLogger';
import type { GestureID } from '../../../core/entities/Gesture';

export interface RecorderStore {
  isRecording: boolean;
  recordingGesture?: GestureID;
}

export class Recorder implements Readable<RecorderStore> {
  private store: Writable<RecorderStore>;

  constructor() {
    this.store = writable({
      isRecording: false,
    });
  }

  public startRecording(
    gesture: GestureID,
    onFinished: (recording: RecordingData) => void,
  ) {
    if (get(this.store).isRecording) {
      ConsoleLogger.warn('Recorder', 'Recording was skipped. Already recording');
      return;
    }
    this.store.update(s => {
      s.isRecording = true;
      s.recordingGesture = gesture;
      return s;
    });
    _startRecording(recording => {
      this.store.update(s => {
        s.isRecording = false;
        s.recordingGesture = undefined;
        return s;
      });
      onFinished(recording);
    });
  }

  public subscribe(
    run: Subscriber<RecorderStore>,
    invalidate?: Invalidator<RecorderStore> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get } from 'svelte/store';
import type { RecordingData } from '../domain/RecordingData';
import { state, stores } from '../stores/Stores';
import StaticConfiguration from '../../StaticConfiguration';
import Logger from './Logger';
import { alertUser } from '../stores/uiStore';
import { t } from '../../i18n';

/**
 * @deprecated Will be removed in the future. Use store.getRecorder().startRecording(...) instead.
 */
export const startRecording = (onFinished: (recording: RecordingData) => void) => {
  if (get(state).isRecording) {
    Logger.warn('Recording', 'Failed to start recording, already recording');
    return;
  }
  const liveData = get(stores).liveData;
  if (!liveData) {
    throw new Error('Cannot start recording, no live-data store');
  }

  state.update(e => {
    e.isRecording = true;
    return e;
  });
  Logger.log('Recording', 'Creating new recording');
  const recordingId = Date.now();
  let labels: string[] = [];

  const samples: RecordingData['samples'] = [];

  const unsubscriber = liveData.subscribe(data => {
    samples.push({
      vector: data.getValue(),
    });
    labels = data.getLabels();
  });
  setTimeout(() => {
    unsubscriber();
    state.update(e => {
      e.isRecording = false;
      return e;
    });
    if (samples.length <= StaticConfiguration.pollingPredictionSampleSize) {
      alertUser(get(t)('alert.recording.disconnectedDuringRecording'));
    }

    if (labels.length === 0) {
      throw new Error('No labels were present during the recording, was this a mistake?');
    }

    const recording: RecordingData = {
      ID: recordingId,
      samples: samples,
      labels: labels,
    };

    onFinished(recording);

    Logger.log('Recording', `Created recording ${recordingId}`);
  }, StaticConfiguration.recordingDuration);
};

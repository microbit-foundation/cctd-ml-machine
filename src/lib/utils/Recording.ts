/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get } from 'svelte/store';
import type { RecordingData } from '../../core/entities/RecordingData';
import { stores } from '../stores/Stores';
import StaticConfiguration from '../../StaticConfiguration';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import { alertUser } from '../stores/uiStore';
import { t } from '../../i18n';
import { Feature, getFeature } from '../FeatureToggles';
import type { Recording } from '../../core/entities/recording/Recording';
import { RecordingImpl } from '../../core/entities/recording/RecordingImpl';
import { Sample } from '../../core/entities/recording/Sample';
import type { Axis } from '../../core/entities/Axis';

/**
 * @deprecated Will be removed in the future. Use store.getRecorder().startRecording(...) instead.
 */
export const startRecording = (onFinished: (recording: Recording) => void) => {
  if (get(stores.getDevices()).isRecording) {
    ConsoleLogger.warn('Recording', 'Failed to start recording, already recording');
    return;
  }
  const liveData = get(stores).liveData;
  if (!liveData) {
    throw new Error('Cannot start recording, no live-data store');
  }

  stores.getDevices().update(e => {
    e.isRecording = true;
    return e;
  });
  ConsoleLogger.log('Recording', 'Creating new recording');
  const recordingId = Date.now();
  let axes: Axis[] = [];

  const samples: Sample[] = [];

  const unsubscriber = liveData.subscribe(data => {
    samples.push(new Sample(data));
    axes = data.getLabels().map((label, index) => ({ index, label }));
  });
  setTimeout(() => {
    unsubscriber();
    stores.getDevices().update(e => {
      e.isRecording = false;
      return e;
    });
    if (samples.length <= StaticConfiguration.pollingPredictionSampleSize) {
      alertUser(get(t)('alert.recording.disconnectedDuringRecording'));
    }

    if (axes.length === 0) {
      throw new Error('No axes were present during the recording, was this a mistake?');
    }

    const recording = new RecordingImpl(recordingId, samples, axes);

    onFinished(recording);

    ConsoleLogger.log('Recording', `Created recording ${recordingId}`);
  }, getFeature<number>(Feature.RECORDING_DURATION));
};

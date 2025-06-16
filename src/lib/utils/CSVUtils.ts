/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { RecordingData } from '../domain/RecordingData';
import type Gesture from '../domain/stores/gesture/Gesture';

export const serializeGestureRecordingsToCSV = (gestures: Gesture[]) => {
  const axes = gestures[0].getRecordings()[0].labels;
  const headers = ['gesture', 'sample', ...axes].join(';');
  return [
    headers,
    gestures.map(gesture => serializeGestureToCSV(gesture)).join('\n'),
  ].join('\n');
};

const serializeGestureToCSV = (gesture: Gesture) => {
  const gestureName = gesture.getName();
  return gesture
    .getRecordings()
    .map(recording => serializeRecordingToCsv(recording, gestureName))
    .join('\n');
};

const serializeRecordingToCsv = (
  recording: RecordingData,
  gestureName: string,
): string => {
  return recording.samples
    .map(
      (sample, idx) =>
        gestureName.replace(';', '\\;') + ';' + idx + ';' + sample.vector.join(';'),
    )
    .join('\n');
};

export const serializeRecordingToCsvWithoutGestureName = (
  recording: RecordingData,
): string => {
  const headers = ['sample', ...recording.labels].join(';');
  const rows = recording.samples
    .map((sample, idx) => idx + ';' + sample.vector.join(';'))
    .join('\n');
  return [headers, rows].join('\n');
};

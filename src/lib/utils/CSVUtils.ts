/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get } from 'svelte/store';
import type { RecordingData } from '../domain/RecordingData';
import type Gesture from '../domain/stores/gesture/Gesture';
import { locale } from 'svelte-i18n';

/**
 * Formats a number according to the current locale's decimal separator
 * @param value The number to format
 * @returns The formatted number string
 */
const formatNumberForLocale = (value: number): string => {
  const currentLocale = get(locale);

  // Convert to string with period as decimal separator (standard JS)
  const numberString = value.toString();

  // Replace decimal separator based on locale
  switch (currentLocale) {
    case 'en':
      // English uses period (.) - no change needed
      return numberString;
    case 'de':
    case 'da':
      // German and Danish use comma (,) as decimal separator
      return numberString.replace('.', ',');
    default:
      // Default to English format
      return numberString;
  }
};

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
        gestureName.replace(';', '\\;') +
        ';' +
        idx +
        ';' +
        sample.vector.map(formatNumberForLocale).join(';'),
    )
    .join('\n');
};

export const serializeRecordingToCsvWithoutGestureName = (
  recording: RecordingData,
): string => {
  const headers = ['sample', ...recording.labels].join(';');
  const rows = recording.samples
    .map((sample, idx) => idx + ';' + sample.vector.map(formatNumberForLocale).join(';'))
    .join('\n');
  return [headers, rows].join('\n');
};

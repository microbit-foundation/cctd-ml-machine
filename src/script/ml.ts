/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { alertUser } from './stores/uiStore';
import { type GestureData, settings } from './stores/mlStore';
import { get } from 'svelte/store';
import { t } from '../i18n';

let text: (key: string, vars?: object) => string;
t.subscribe(t => (text = t));

export function isParametersLegal(): boolean {
  const s = get(settings);
  return s.includedAxes.length > 0 && s.includedFilters.size > 0;
}

// Assess whether each gesture has sufficient data. (Limited by three)
export function sufficientGestureData(gestureData: GestureData[], messageUser: boolean) {
  let sufficientData = true;
  gestureData.forEach(gesture => {
    if (gesture.recordings.length < 3) {
      if (messageUser) {
        alertUser(text('alert.recordingsPerGesture'));
      }
      sufficientData = false;
    }
  });
  return sufficientData;
}

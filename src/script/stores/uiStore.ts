/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { type Writable, derived, get, writable } from 'svelte/store';
import {
  type CompatibilityStatus,
  checkCompatibility,
} from '../compatibility/CompatibilityChecker';
import { t } from '../../i18n';
import CookieManager from '../CookieManager';
import { isInputPatternValid } from './connectionStore';
import Gesture from '../domain/stores/gesture/Gesture';
import { state, stores } from './Stores';

let text: (key: string, vars?: object) => string;
t.subscribe(t => (text = t));

export const compatibility: Writable<CompatibilityStatus> =
  writable(await checkCompatibility());

export const chosenGesture = writable<Gesture | null>(null);

export const isBluetoothWarningDialogOpen = derived(
  compatibility,
  stores => !stores.bluetooth,
);

// Message store to propagate allow all components to inform users.
export const message = writable<{ warning: boolean; text: string }>({
  warning: false,
  text: '',
});

// Message store to propagate allow all components to inform users.
export const outputting = writable<{ text: string }>({ text: '' });

// Alert user sets current message to text and hightlights it.
export function alertUser(text: string): void {
  message.set({
    warning: true,
    text: text,
  });
}

// Assess whether an action is allowed. Alert user if not
export function areActionsAllowed(actionAllowed = true, alertIfNotReady = true): boolean {
  const status = assessStateStatus(actionAllowed);

  if (!status.isReady && alertIfNotReady) {
    alertUser(status.msg);
  }

  return status.isReady;
}

// Assess status and return message to alert user.
function assessStateStatus(actionAllowed = true): { isReady: boolean; msg: string } {
  const currentState = get(state);

  const model = stores.getClassifier().getModel();

  if (currentState.isRecording) return { isReady: false, msg: text('alert.isRecording') };
  if (model.isTraining()) return { isReady: false, msg: text('alert.isTraining') };
  if (!currentState.isInputConnected && actionAllowed)
    return { isReady: false, msg: text('alert.isNotConnected') };

  return { isReady: true, msg: '' };
}

export const buttonPressed = writable<{ buttonA: 0 | 1; buttonB: 0 | 1 }>({
  buttonA: 0,
  buttonB: 0,
});

export enum MicrobitInteractions {
  A,
  B,
  AB,
}

const initialMicrobitInteraction: MicrobitInteractions = MicrobitInteractions.AB;

export const microbitInteraction = writable<MicrobitInteractions>(
  initialMicrobitInteraction,
);

/**
 * Workaround for an unrecoverable reconnect failure due to a bug in chrome/chromium.
 * This error occurs, when a connection is established, but lost again before listening to the characteristics
 * Refresh the page is the only known solution
 */
export const onCatastrophicError = (reconnect?: boolean) => {
  // Set flag to offer reconnect when page reloads
  if (isInputPatternValid() && reconnect) {
    CookieManager.setReconnectFlag();
  }
  location.reload();
};

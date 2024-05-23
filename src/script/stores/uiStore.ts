/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { Writable, derived, get, writable } from 'svelte/store';
import {
  type CompatibilityStatus,
  checkCompatibility,
} from '../compatibility/CompatibilityChecker';
import { t } from '../../i18n';
import { DeviceRequestStates } from './connectDialogStore';
import CookieManager from '../CookieManager';
import { isInputPatternValid } from './connectionStore';
import { classifier } from './Stores';
import Gesture from '../domain/stores/gesture/Gesture';
import Axes from '../domain/Axes';
import PersistantWritable from '../repository/PersistantWritable';
import { DropdownOption } from '../../components/buttons/Buttons';

let text: (key: string, vars?: object) => string;
t.subscribe(t => (text = t));

export const compatibility: Writable<CompatibilityStatus> =
  writable(checkCompatibility());

export const chosenGesture = writable<Gesture | null>(null);

export const isBluetoothWarningDialogOpen = derived(
  compatibility,
  stores => !stores.bluetooth,
);

export enum ModelView {
  TILE,
  STACK,
}

// Store current state to prevent error prone actions
export const state = writable<{
  isRequestingDevice: DeviceRequestStates;
  isFlashingDevice: boolean;
  isRecording: boolean;
  isInputConnected: boolean;
  isOutputConnected: boolean;
  offerReconnect: boolean;
  requestDeviceWasCancelled: boolean;
  reconnectState: DeviceRequestStates;
  isInputReady: boolean;
  isInputAssigned: boolean;
  isOutputAssigned: boolean;
  isOutputReady: boolean;
  isLoading: boolean;
  modelView: ModelView;
  isInputOutdated: boolean;
  isOutputOutdated: boolean;
}>({
  isRequestingDevice: DeviceRequestStates.NONE,
  isFlashingDevice: false,
  isRecording: false,
  isInputConnected: false,
  isOutputConnected: false,
  offerReconnect: false,
  requestDeviceWasCancelled: false,
  reconnectState: DeviceRequestStates.NONE,
  isInputReady: false,
  isInputAssigned: false,
  isOutputAssigned: false,
  isOutputReady: false,
  isLoading: true,
  modelView: ModelView.STACK,
  isInputOutdated: false,
  isOutputOutdated: false,
});

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

  const model = classifier.getModel();

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

export type ModelEntry = {
  id: string;
  title: string;
  label: string;
};

export const availableModels: ModelEntry[] = [
  {
    id: 'NN',
    title: 'Neural network',
    label: 'neural network',
  },
  {
    id: 'KNN',
    title: 'KNN',
    label: 'KNN',
  },
];

const defaultModel: ModelEntry | undefined = availableModels.find(
  model => model.id === 'NN',
);

if (!defaultModel) {
  throw new Error('Default model not found!');
}
// TODO: Should just be model id instead of dropdown option
export const preferredModel = new PersistantWritable<DropdownOption>(
  {
    id: defaultModel.id,
    label: defaultModel.label,
  },
  'prefferedModel',
);

// TODO: Should probably be elsewhere
export const prevHighlightedAxis = writable<Axes | undefined>(undefined);
export const highlightedAxis = writable<Axes | undefined>(undefined);

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

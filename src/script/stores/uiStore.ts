import { get, writable } from 'svelte/store';
import { type CompatibilityStatus, checkCompatibility} from '../compatibility/CompatibilityChecker';
import { t } from '../../i18n';
import { gestures } from './mlStore';
import { DeviceRequestStates } from './connectDialogStore';

// TODO: Rename? Split up further?

let text: (key: string, vars?: object) => string;
t.subscribe(t => (text = t));

export const compatibility = writable<CompatibilityStatus>(
  checkCompatibility(),
);

export const isBluetoothWarningDialogOpen = writable<boolean>(
  get(compatibility) ? !get(compatibility).bluetooth : false,
);

// Store current state to prevent error prone actions
export const state = writable<{
  isRequestingDevice:
    | DeviceRequestStates.NONE
    | DeviceRequestStates.OUTPUT
    | DeviceRequestStates.INPUT; // fix for a bug caused by too low rollup version. Must be 3x or higher.
  isFlashingDevice: boolean;
  isTesting: boolean;
  isRecording: boolean;
  isTraining: boolean;
  isInputConnected: boolean;
  isOutputConnected: boolean;
  isPredicting: boolean;
  offerReconnect: boolean;
  requestDeviceWasCancelled: boolean;
  reconnectState: DeviceRequestStates;
  isInputReady: boolean;
  isInputAssigned: boolean;
  isOutputAssigned: boolean;
  isOutputReady: boolean;
  isLoading: boolean;
}>({
  isRequestingDevice: DeviceRequestStates.NONE,
  isFlashingDevice: false,
  isTesting: false,
  isRecording: false,
  isTraining: false,
  isInputConnected: false,
  isOutputConnected: false,
  isPredicting: false,
  offerReconnect: false,
  requestDeviceWasCancelled: false,
  reconnectState: DeviceRequestStates.NONE,
  isInputReady: false,
  isInputAssigned: false,
  isOutputAssigned: false,
  isOutputReady: false,
  isLoading: true,
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
export function isReady(actionAllowed = true, alertIfNotReady = true): boolean {
  const status = assessStateStatus(actionAllowed);

  if (!status.isReady && alertIfNotReady) {
    alertUser(status.msg);
  }

  return status.isReady;
}

// Assess status and return message to alert user.
function assessStateStatus(actionAllowed = true): { isReady: boolean; msg: string } {
  const currentState = get(state);

  if (currentState.isRecording) return { isReady: false, msg: text('alert.isRecording') };
  if (currentState.isTesting) return { isReady: false, msg: text('alert.isTesting') };
  if (currentState.isTraining) return { isReady: false, msg: text('alert.isTraining') };
  if (!currentState.isInputConnected && actionAllowed)
    return { isReady: false, msg: text('alert.isNotConnected') };

  return { isReady: true, msg: '' };
}

export const hasSufficientData = (): boolean => {
  if (!get(gestures)) {
    return false;
  }
  if (get(gestures).length < 2) {
    return false;
  }
  return !get(gestures).some(gesture => gesture.recordings.length < 3);
};

export const buttonPressed = writable<{ buttonA: 0 | 1; buttonB: 0 | 1 }>({
  buttonA: 0,
  buttonB: 0,
});

export enum MicrobitInteractions {A, B, AB}

const initialMicrobitInteraction: MicrobitInteractions = MicrobitInteractions.AB;

export const microbitInteraction = writable<MicrobitInteractions>(initialMicrobitInteraction);

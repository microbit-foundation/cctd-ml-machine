/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';

export enum DeviceRequestStates {
  NONE,
  INPUT,
  OUTPUT,
}
export enum ModelView {
  TILE,
  STACK,
}
export interface ApplicationStates {
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
  isInputInitializing: boolean;
  isLoading: boolean;
  modelView: ModelView;
  isInputOutdated: boolean;
  isOutputOutdated: boolean;
}
// TODO: Application state, used as a dumping ground for shared variables. Should be split up
export const state = writable<ApplicationStates>({
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
  isInputInitializing: false,
  isLoading: true,
  modelView: ModelView.STACK,
  isInputOutdated: false,
  isOutputOutdated: false,
});

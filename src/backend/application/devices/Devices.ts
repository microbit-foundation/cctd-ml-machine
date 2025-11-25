/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

// TODO: Needs some cleanup

// TODO: Rename and put into it's own file
export enum DeviceRequestStates {
  NONE,
  INPUT,
  OUTPUT,
}

// TODO: Convert to an actual implementable interface, separate domain stuff
export interface DevicesType {
  isRequestingDevice: DeviceRequestStates;
  isFlashingDevice: boolean;

  /**
   * @deprecated should be moved to the 'Recorder' store
   */
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
  isInputOutdated: boolean;
  isOutputOutdated: boolean;
}

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable } from 'svelte/store';
import { state } from './uiStore';

export enum DeviceRequestStates {
  NONE,
  INPUT,
  OUTPUT,
}
export enum ConnectDialogStates {
  NONE, // No connection in progress -> Dialog box closed
  START_RADIO, // Initial box. Main prompt is to connect via radio however includes choice to connect via bluetooth
  CONNECT_CABLE_MB1, // Instructions to connect micro:bit 1 via usb
  USB_DOWNLOADING_MB1, // Downloading via usb to micro:bit 1 prompt
  CONNECT_BATTERY_MB1, // Instructions to connect micro:bit 1 to battery
  CONNECT_CABLE_MB2, // Instructions to connect micro:bit 2 via usb
  USB_DOWNLOADING_MB2, // Downloading via usb to micro:bit 2 prompt
  CONNECTING_MICROBITS, // Micro:bits connecting prompt

  START_BLUETOOTH, // Initial box to begin the bluetooth connection flow
  START_OUTPUT, // Initial box if input microbit is already connected. Choice between same and other microbit for output
  BAD_FIRMWARE, // We detected an issue with the firmware of the micro:bit trying to transfer program.
  CONNECT_CABLE, // Instructions how to connect micro:bit via usb
  CONNECT_TUTORIAL_USB, // Instructions how to select micro:bit on popup when connected by usb
  USB_DOWNLOADING, // Downloading usb program status bar prompt
  CONNECT_BATTERY, // Instructions to connect micro:bit to battery
  BLUETOOTH, // Bluetooth connect prompt, with pattern drawing
  CONNECT_TUTORIAL_BLUETOOTH, // Instructions on how to connect micro:bit when connecting to bluetooth
  BLUETOOTH_CONNECTING, // Downloading BlueTooth prompt
  USB_START, // Initial usb installation prompt
  USB_DONE, // Installation done prompt
  MANUAL_TUTORIAL, // Prompt with tutorial gif for manual installation (and downloading of program)
}

export const connectionDialogState = writable<{
  connectionState: ConnectDialogStates;
  deviceState: DeviceRequestStates;
}>({
  connectionState: ConnectDialogStates.NONE,
  deviceState: DeviceRequestStates.NONE,
});

export const startConnectionProcess = (): void => {
  connectionDialogState.update(s => {
    s.connectionState = get(state).isInputConnected
      ? ConnectDialogStates.START_OUTPUT
      : ConnectDialogStates.START_RADIO;
    s.deviceState = get(state).isInputConnected
      ? DeviceRequestStates.OUTPUT
      : DeviceRequestStates.INPUT;
    return s;
  });
};

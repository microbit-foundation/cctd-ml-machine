/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type MicrobitBluetooth from '../MicrobitBluetooth';
import {
  ModelView,
  buttonPressed,
  onCatastrophicError,
  state,
} from '../../stores/uiStore';
import { t } from '../../../i18n';
import { get } from 'svelte/store';
import MBSpecs from '../MBSpecs';
import LoggingDecorator from './LoggingDecorator';
import TypingUtils from '../../TypingUtils';
import { DeviceRequestStates } from '../../stores/connectDialogStore';
import StaticConfiguration from '../../../StaticConfiguration';
import { liveAccelerometerData, liveMagnetometerData } from '../../stores/Stores';

let text = get(t);
t.subscribe(t => (text = t));

/**
 * Implementation of the input ConnectionBehaviour
 */
class InputBehaviour extends LoggingDecorator {
  private reconnectTimeout = setTimeout(TypingUtils.emptyFunction, 0);

  onBluetoothConnectionError(error?: unknown) {
    super.onBluetoothConnectionError(error);
    state.update(s => {
      s.isInputConnected = false;
      s.isInputAssigned = false;
      return s;
    });
  }

  onIdentifiedAsOutdated(): void {
    super.onIdentifiedAsOutdated();
    state.update(s => {
      s.isInputOutdated = true;
      return s;
    });
  }

  onVersionIdentified(versionNumber: number): void {
    super.onVersionIdentified(versionNumber);
  }

  onIdentifiedAsMakecode(): void {
    super.onIdentifiedAsMakecode();
    state.update(s => {
      s.modelView = ModelView.TILE;
      return s;
    });
  }

  onIdentifiedAsProprietary(): void {
    super.onIdentifiedAsProprietary();
  }

  onGestureRecognized(id: number, gestureName: string): void {
    super.onGestureRecognized(id, gestureName);
  }

  onUartMessageReceived(message: string): void {
    super.onUartMessageReceived(message);
  }

  onReady() {
    super.onReady();
    clearTimeout(this.reconnectTimeout);
    state.update(s => {
      s.isInputReady = true;
      return s;
    });
  }

  onAssigned(microbitBluetooth: MicrobitBluetooth, name: string) {
    super.onAssigned(microbitBluetooth, name);
    state.update(s => {
      s.isInputAssigned = true;
      return s;
    });
  }

  onExpelled(manual?: boolean, bothDisconnected?: boolean): void {
    super.onExpelled(manual, bothDisconnected);
    state.update(s => {
      s.isInputConnected = false;
      s.isInputAssigned = false;
      s.isInputReady = false;
      s.offerReconnect = !manual;
      s.reconnectState = DeviceRequestStates.INPUT;
      return s;
    });
    clearTimeout(this.reconnectTimeout);
  }

  onCancelledBluetoothRequest(): void {
    super.onCancelledBluetoothRequest();
    state.update(s => {
      s.requestDeviceWasCancelled = true;
      s.isInputConnected = false;
      return s;
    });
  }

  onDisconnected(): void {
    super.onDisconnected();
    state.update(s => {
      s.isInputConnected = false;
      s.offerReconnect = false;
      s.isInputReady = false;
      s.reconnectState = DeviceRequestStates.NONE;
      s.isInputOutdated = false;
      return s;
    });
  }

  onConnected(name: string): void {
    super.onConnected(name);

    state.update(s => {
      s.isInputConnected = true;
      s.isRequestingDevice = DeviceRequestStates.NONE;
      s.offerReconnect = false;
      return s;
    });

    // Works like this: If the MB manages to connect, wait `reconnectTimeoutDuration` milliseconds
    // if MB does not call onReady before that expires, refresh the page
    clearTimeout(this.reconnectTimeout);
    const onTimeout = () => onCatastrophicError();
    this.reconnectTimeout = setTimeout(function () {
      onTimeout();
    }, StaticConfiguration.reconnectTimeoutDuration);
  }

  accelerometerChange(x: number, y: number, z: number): void {
    super.accelerometerChange(x, y, z);

    const accelX = x / 1000.0;
    const accelY = y / 1000.0;
    const accelZ = z / 1000.0;

    liveAccelerometerData.put({
      x: accelX,
      y: accelY,
      z: accelZ
    });
  }

  magnetometerChange(x: number, y: number, z: number): void {
    super.magnetometerChange(x, y, z);

    // Each value has absolute value <= 2^15, so we rescale to get all values in [-2.5,2.5]
    const accelX = Math.sign(x) * Math.log2(Math.abs(x)) / 6;
    const accelY = Math.sign(y) * Math.log2(Math.abs(y)) / 6;
    const accelZ = Math.sign(z) * Math.log2(Math.abs(z)) / 6;

    liveMagnetometerData.put({
      x: accelX,
      y: accelY,
      z: accelZ
    });
  }

  buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {
    super.buttonChange(buttonState, button);
    if (buttonState === MBSpecs.ButtonStates.Released) return;
    if (button === MBSpecs.Button.A) {
      buttonPressed.update(obj => {
        obj.buttonA = 1;
        obj.buttonB = 0;
        return obj;
      });
    } else {
      buttonPressed.update(obj => {
        obj.buttonA = 0;
        obj.buttonB = 1;
        return obj;
      });
    }
  }
}

export default InputBehaviour;

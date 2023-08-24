/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type MicrobitBluetooth from '../microbit-interfacing/MicrobitBluetooth';
import { buttonPressed, state } from '../stores/uiStore';
import { livedata } from '../stores/mlStore';
import { t } from '../../i18n';
import { get } from 'svelte/store';
import MBSpecs from '../microbit-interfacing/MBSpecs';
import LoggingDecorator from './LoggingDecorator';
import CookieManager from '../CookieManager';
import TypingUtils from '../TypingUtils';
import { DeviceRequestStates } from '../stores/connectDialogStore';
import StaticConfiguration from '../../StaticConfiguration';

let text = get(t);
t.subscribe(t => (text = t));

/**
 * Implementation of the input ConnectionBehaviour
 */
class InputBehaviour extends LoggingDecorator {
  private smoothedAccelX = 0;
  private smoothedAccelY = 0;
  private smoothedAccelZ = 0;

  private reconnectTimeout = setTimeout(TypingUtils.emptyFunction, 0);

  onBluetoothConnectionError(error?: unknown) {
    super.onBluetoothConnectionError(error);
    state.update(s => {
      s.isInputConnected = false;
      s.isInputAssigned = false;
      return s;
    });
  }

  onGestureRecognized(id: number, gestureName: string): void {
    super.onGestureRecognized(id, gestureName);
  }

  onUartMessageReceived(message: string): void {
    super.onUartMessageReceived(message);
    if (message === "id_mkcd") {
      this.announceIsMakecode();
    }
  }

  private announceIsMakecode() {
    state.update(s => {
      s.isInputMakecodeHex = true;
      return s;
    })
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
    microbitBluetooth.listenToUART((data) => this.onUartMessageReceived(data))
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
      s.isInputMakecodeHex = false;
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
    const onTimeout = () => this.onCatastrophicError();
    this.reconnectTimeout = setTimeout(function () {
      onTimeout();
    }, StaticConfiguration.reconnectTimeoutDuration);
  }

  accelerometerChange(x: number, y: number, z: number): void {
    super.accelerometerChange(x, y, z);

    const accelX = x / 1000.0;
    const accelY = y / 1000.0;
    const accelZ = z / 1000.0;
    this.smoothedAccelX = accelX * 0.25 + this.smoothedAccelX * 0.75;
    this.smoothedAccelY = accelY * 0.25 + this.smoothedAccelY * 0.75;
    this.smoothedAccelZ = accelZ * 0.25 + this.smoothedAccelZ * 0.75;

    livedata.set({
      accelX,
      accelY,
      accelZ,
      smoothedAccelX: this.smoothedAccelX,
      smoothedAccelY: this.smoothedAccelY,
      smoothedAccelZ: this.smoothedAccelZ,
    });
  }

  buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {
    super.buttonChange(buttonState, button);
    if (buttonState === MBSpecs.ButtonStates.Released) return;
    if (button === 'A') {
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

  /**
   * Workaround for an unrecoverable reconnect failure due to a bug in chrome/chromium
   * Refresh the page is the only known solution
   * @private
   */
  private onCatastrophicError() {
    // Set flag to offer reconnect when page reloads
    CookieManager.setReconnectFlag();
    location.reload();
  }
}

export default InputBehaviour;

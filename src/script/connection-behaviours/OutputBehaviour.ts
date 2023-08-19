/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type MicrobitBluetooth from '../microbit-interfacing/MicrobitBluetooth';
import { state } from '../stores/uiStore';
import { t } from '../../i18n';
import { get } from 'svelte/store';
import MBSpecs from '../microbit-interfacing/MBSpecs';
import LoggingDecorator from './LoggingDecorator';
import CookieManager from '../CookieManager';
import TypingUtils from '../TypingUtils';
import { DeviceRequestStates } from '../stores/connectDialogStore';
import Microbits from '../microbit-interfacing/Microbits';
import StaticConfiguration from '../../StaticConfiguration';

let text = get(t);
t.subscribe(t => (text = t));

class OutputBehaviour extends LoggingDecorator {
  private reconnectTimeout: NodeJS.Timeout = setTimeout(TypingUtils.emptyFunction, 0);

  onBluetoothConnectionError(error?: unknown) {
    super.onBluetoothConnectionError(error);
    state.update(s => {
      s.isOutputConnected = false;
      s.isOutputAssigned = false;
      return s;
    });
  }

  onGestureRecognized(id: number, gestureName: string): void {
    super.onGestureRecognized(id, gestureName);
    if (Microbits.isOutputReady()) {
      Microbits.sendUARTGestureMessageToOutput(gestureName);
    }
  }

  onUartMessageReceived(message: string): void {
    super.onUartMessageReceived(message);
    if (message === "id_mkcd") {
      this.announceIsMakecode();
    }
  }

  private announceIsMakecode() {
    state.update(s => {
      s.isOutputMakecodeHex = true;
      return s;
    })
  }

  onReady() {
    super.onReady();

    if (Microbits.isInputOutputTheSame()) {
      state.update(s => {
        s.isOutputMakecodeHex = s.isInputMakecodeHex;
        return s;
      })
    }

    // Reset any output pins currently active.
    const pinResetArguments: { pin: MBSpecs.UsableIOPin; on: boolean }[] = [];
    StaticConfiguration.supportedPins.forEach(pin => {
      const argument = { pin: pin, on: false };
      pinResetArguments.push(argument);
    });
    Microbits.sendToOutputPin(pinResetArguments);

    state.update(s => {
      s.isOutputReady = true;
      return s;
    });
    clearTimeout(this.reconnectTimeout);
  }

  onAssigned(microbitBluetooth: MicrobitBluetooth, name: string) {
    super.onAssigned(microbitBluetooth, name);
    microbitBluetooth.listenToUART((data) => this.onUartMessageReceived(data))
    state.update(s => {
      s.isOutputAssigned = true;
      return s;
    });
  }

  onExpelled(manual?: boolean, bothDisconnected?: boolean): void {
    super.onExpelled(manual, bothDisconnected);
    state.update(s => {
      s.isOutputConnected = false;
      s.offerReconnect = !manual;
      s.isOutputAssigned = false;
      s.isOutputReady = false;
      if (!bothDisconnected) {
        s.reconnectState = DeviceRequestStates.OUTPUT;
      }
      return s;
    });
    clearTimeout(this.reconnectTimeout);
  }

  onCancelledBluetoothRequest(): void {
    super.onCancelledBluetoothRequest();
    state.update(s => {
      s.isOutputConnected = false;
      s.requestDeviceWasCancelled = true;
      return s;
    });
  }

  accelerometerChange(x: number, y: number, z: number): void {
    return;
  }

  buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {
    return;
  }

  onConnected(name: string): void {
    super.onConnected(name);

    state.update(s => {
      s.isOutputConnected = true;
      s.isRequestingDevice = DeviceRequestStates.NONE;
      s.offerReconnect = false;
      return s;
    });

    // Reset connection reconnectTimeoutTime
    clearTimeout(this.reconnectTimeout);
    const onTimeout = () => this.onCatastrophicError();
    this.reconnectTimeout = setTimeout(function () {
      onTimeout();
    }, StaticConfiguration.reconnectTimeoutDuration);
  }

  onDisconnected(): void {
    super.onDisconnected();
    // Ensure state is updated
    state.update(s => {
      s.isOutputConnected = false;
      s.isOutputReady = false;
      s.isOutputMakecodeHex = false;
      return s;
    });
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

export default OutputBehaviour;

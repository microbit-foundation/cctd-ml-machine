/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { MBSpecs, type MicrobitHandler } from 'microbyte';
import { onCatastrophicError } from '../stores/uiStore';
import StaticConfiguration from '../../StaticConfiguration';
import TypingUtils from '../TypingUtils';
import Logger from '../utils/Logger';
import Microbits from './Microbits';
import { HexOrigin } from './HexOrigin';
import type Devices from '../domain/Devices';
import { ModelView, modelView } from '../stores/ApplicationState';
import { DeviceRequestStates } from '../domain/Devices';

class OutputMicrobitHandler implements MicrobitHandler {
  private reconnectTimeout = setTimeout(TypingUtils.emptyFunction, 0);
  private lastConnectedVersion: MBSpecs.MBVersion | undefined;

  public constructor(private devices: Devices) {}

  public onConnected(versionNumber?: MBSpecs.MBVersion | undefined): void {
    Logger.log('OutputMicrobitHandler', 'onConnected', versionNumber);

    const pinResetArguments: { pin: MBSpecs.UsableIOPin; on: boolean }[] = [];
    StaticConfiguration.supportedPins.forEach(pin => {
      const argument = { pin: pin, on: false };
      pinResetArguments.push(argument);
    });

    Microbits.sendToOutputPin(pinResetArguments);
    this.devices.update(s => {
      if (Microbits.isInputOutputTheSame()) {
        if (Microbits.isOutputMakecode()) {
          modelView.set(ModelView.TILE);
        }
      }
      s.isOutputConnected = true;
      s.isOutputAssigned = true;
      s.isRequestingDevice = DeviceRequestStates.NONE;
      s.offerReconnect = false;
      s.isOutputReady = true;
      return s;
    });

    this.lastConnectedVersion = versionNumber;
    clearTimeout(this.reconnectTimeout);
  }

  public onInitializing(): void {
    clearTimeout(this.reconnectTimeout);
    const onTimeout = () => onCatastrophicError(false);
    this.reconnectTimeout = setTimeout(function () {
      onTimeout();
    }, StaticConfiguration.reconnectTimeoutDuration);
  }

  public onConnecting() {
    Logger.log('OutputMicrobitHandler', 'onConnecting');
  }

  public onDisconnected(): void {
    Logger.log('OutputMicrobitHandler', 'onDisconnected');
    this.devices.update(s => {
      s.isOutputConnected = false;
      s.isOutputReady = false;
      s.isOutputOutdated = false;
      return s;
    });
  }

  public onAccelerometerDataReceived(x: number, y: number, z: number): void {}

  public onButtonAPressed(state: MBSpecs.ButtonState): void {}

  public onButtonBPressed(state: MBSpecs.ButtonState): void {}

  public onMessageReceived(data: string): void {
    if (data === 'id_mkcd') {
      Microbits.setOutputOrigin(HexOrigin.MAKECODE);
      modelView.set(ModelView.TILE);
    }
    if (data === 'id_prop') {
      Microbits.setOutputOrigin(HexOrigin.PROPRIETARY);
      modelView.set(ModelView.STACK);
    }
    if (data.includes('vi_')) {
      const version = parseInt(data.substring(3));
      const isOutdated = StaticConfiguration.isMicrobitOutdated(
        Microbits.getOutputOrigin(),
        version,
      );
      Logger.log('OutputMicrobitHandler', 'Is microbit outdated: ' + isOutdated);
    }
  }

  public onReconnecting(): void {
    Logger.log('OutputMicrobitHandler', 'onReconnecting');
    this.onConnecting();
  }

  public onReconnected() {
    Logger.log('OutputMicrobitHandler', 'onReconnected');
    this.onConnected(this.lastConnectedVersion);
  }

  public onConnectError(error: Error): void {
    Logger.log('OutputMicrobitHandler', 'onConnectError', error);
    this.devices.update(s => {
      s.isOutputConnected = false;
      s.isOutputAssigned = false;
      s.isOutputReady = false;
      return s;
    });
  }

  public onReconnectError(error: Error): void {
    Logger.log('OutputMicrobitHandler', 'onReconnectError', error);
    this.onConnectError(error);
  }

  public onClosed() {
    Logger.log('OutputMicrobitHandler', 'onClosed');
    this.devices.update(s => {
      s.isOutputConnected = false;
      s.isOutputAssigned = false;
      s.isOutputReady = false;
      s.offerReconnect = true;
      s.reconnectState = DeviceRequestStates.OUTPUT;
      return s;
    });
  }

  public onClosedError(error: Error): void {
    throw new Error('Not sure what to do here');
  }
}

export default OutputMicrobitHandler;

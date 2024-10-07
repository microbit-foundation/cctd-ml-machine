/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { MBSpecs, MicrobitHandler } from 'microbyte';
import { ModelView, onCatastrophicError, state } from '../stores/uiStore';
import { DeviceRequestStates } from '../stores/connectDialogStore';
import StaticConfiguration from '../../StaticConfiguration';
import TypingUtils from '../TypingUtils';
import Logger from '../utils/Logger';
import Microbits, { HexOrigin } from './Microbits';

class OutputMicrobitHandler implements MicrobitHandler {
  private reconnectTimeout = setTimeout(TypingUtils.emptyFunction, 0);
  private lastConnectedVersion: MBSpecs.MBVersion | undefined;

  public onConnected(versionNumber?: MBSpecs.MBVersion | undefined): void {
    Logger.log('OutputMicrobitHandler', 'onConnected', versionNumber);

    const pinResetArguments: { pin: MBSpecs.UsableIOPin; on: boolean }[] = [];
    StaticConfiguration.supportedPins.forEach(pin => {
      const argument = { pin: pin, on: false };
      pinResetArguments.push(argument);
    });

    Microbits.sendToOutputPin(pinResetArguments);
    state.update(s => {
      if (Microbits.isInputOutputTheSame()) {
        s.modelView = Microbits.isOutputMakecode() ? ModelView.TILE : s.modelView;
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

  public onConnecting() {
    Logger.log('OutputMicrobitHandler', 'onConnecting');
    clearTimeout(this.reconnectTimeout);
    const onTimeout = () => onCatastrophicError(false);
    this.reconnectTimeout = setTimeout(function () {
      onTimeout();
    }, StaticConfiguration.reconnectTimeoutDuration);
  }

  public onDisconnected(): void {
    Logger.log('OutputMicrobitHandler', 'onDisconnected');
    state.update(s => {
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
      state.update(s => {
        s.modelView = ModelView.TILE;
        return s;
      });
    }
    if (data === 'id_prop') {
      Microbits.setOutputOrigin(HexOrigin.PROPRIETARY);
      state.update(s => {
        s.modelView = ModelView.STACK;
        return s;
      });
    }
    if (data.includes('vi_')) {
      const version = parseInt(data.substring(3));
      Microbits.setOutputBuildVersion(version);
      const isOutdated = StaticConfiguration.isMicrobitOutdated(
        Microbits.getOutputOrigin(),
        version,
      ); // TODO: Maybe do something with this information
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
    state.update(s => {
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
    state.update(s => {
      s.isOutputConnected = false;
      s.isOutputAssigned = false;
      s.isOutputReady = false;

      s.reconnectState = DeviceRequestStates.OUTPUT;
      return s;
    });
  }

  public onClosedError(error: Error): void {
    throw new Error('Not sure what to do here');
  }
}

export default OutputMicrobitHandler;

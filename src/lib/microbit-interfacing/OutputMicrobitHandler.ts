/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { MBSpecs, type MicrobitHandler } from 'microbyte';
import StaticConfiguration from '../../StaticConfiguration';
import TypingUtils from '../TypingUtils';
import Microbits from './Microbits';
import { HexOrigin } from './HexOrigin';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import { onCatastrophicError } from '../utils/ErrorReconnect';
import { getControllers } from '../../backend/interface-adapter/MLMachine';
import { MicrobitConnectionStateImpl } from '../../backend/domain/implementation/microbit/MicrobitConnectionStateImpl';
import { DeviceRequestState } from '../../backend/application/devices/DeviceRequestState';

class OutputMicrobitHandler implements MicrobitHandler {
  private log = new ConsoleLogger(OutputMicrobitHandler.name);
  private reconnectTimeout = setTimeout(TypingUtils.emptyFunction, 0);
  private lastConnectedVersion: MBSpecs.MBVersion | undefined;

  public constructor() {}

  public onConnected(versionNumber?: MBSpecs.MBVersion | undefined): void {
    ConsoleLogger.log('OutputMicrobitHandler', 'onConnected', versionNumber);

    const pinResetArguments: { pin: MBSpecs.UsableIOPin; on: boolean }[] = [];
    StaticConfiguration.supportedPins.forEach(pin => {
      const argument = { pin: pin, on: false };
      pinResetArguments.push(argument);
    });

    Microbits.sendToOutputPin(pinResetArguments);

    if (Microbits.isInputOutputTheSame()) {
      if (Microbits.isOutputMakecode()) {
        getControllers().getOutputController().setOutputTargetMakecode();
      }
    }
    const microbitController = getControllers().getMicrobitController();
    microbitController.setDeviceRequestState(DeviceRequestState.NONE);

    const microbitConnection = microbitController.getMicrobitConnectionState();
    const curConn = microbitConnection.get();
    const oldOutput = curConn.getOutput();
    const newOutput = new MicrobitConnectionStateImpl(
      true,
      true,
      true,
      oldOutput ? oldOutput.isOutdated() : false,
      false,
    );
    curConn.setOutput(newOutput);
    microbitController.setMicrobitConnection(curConn);
    microbitController.clearReconnectOffering();

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
    ConsoleLogger.log('OutputMicrobitHandler', 'onConnecting');
  }

  public onDisconnected(): void {
    ConsoleLogger.log('OutputMicrobitHandler', 'onDisconnected');
    const microbitController = getControllers().getMicrobitController();
    const microbitConnection = microbitController.getMicrobitConnectionState();
    const curConnDisc = microbitConnection.get();
    const oldOutputDisc = curConnDisc.getOutput();
    const newOutputDisc = new MicrobitConnectionStateImpl(
      false,
      oldOutputDisc ? oldOutputDisc.isAssigned() : false,
      false,
      false,
      oldOutputDisc ? oldOutputDisc.isInitializing() : false,
    );
    curConnDisc.setOutput(newOutputDisc);
    microbitController.setMicrobitConnection(curConnDisc);
  }

  public onAccelerometerDataReceived(x: number, y: number, z: number): void {}

  public onButtonAPressed(state: MBSpecs.ButtonState): void {}

  public onButtonBPressed(state: MBSpecs.ButtonState): void {}

  public onMessageReceived(data: string): void {
    if (data === 'id_mkcd') {
      Microbits.setOutputOrigin(HexOrigin.MAKECODE);
      getControllers().getOutputController().setOutputTargetMakecode();
    }
    if (data === 'id_prop') {
      Microbits.setOutputOrigin(HexOrigin.PROPRIETARY);
      getControllers().getOutputController().setOutputTargetOutputMicrobit();
    }
    if (data.includes('vi_')) {
      const version = parseInt(data.substring(3));
      const isOutdated = StaticConfiguration.isMicrobitOutdated(
        Microbits.getOutputOrigin(),
        version,
      );
      ConsoleLogger.log('OutputMicrobitHandler', 'Is microbit outdated: ' + isOutdated);
    }
  }

  public onReconnecting(): void {
    ConsoleLogger.log('OutputMicrobitHandler', 'onReconnecting');
    this.onConnecting();
  }

  public onReconnected() {
    ConsoleLogger.log('OutputMicrobitHandler', 'onReconnected');
    this.onConnected(this.lastConnectedVersion);
  }

  public onConnectError(error: Error): void {
    ConsoleLogger.log('OutputMicrobitHandler', 'onConnectError', error);
    const microbitController = getControllers().getMicrobitController();
    const microbitConnection = microbitController.getMicrobitConnectionState();
    const curConnErr = microbitConnection.get();
    const newOutputErr = new MicrobitConnectionStateImpl(
      false,
      false,
      false,
      curConnErr.getOutput() ? curConnErr.getOutput().isOutdated() : false,
      curConnErr.getOutput() ? curConnErr.getOutput().isInitializing() : false,
    );
    curConnErr.setOutput(newOutputErr);
    microbitController.setMicrobitConnection(curConnErr);
  }

  public onReconnectError(error: Error): void {
    ConsoleLogger.log('OutputMicrobitHandler', 'onReconnectError', error);
    this.onConnectError(error);
  }

  public onClosed() {
    ConsoleLogger.log('OutputMicrobitHandler', 'onClosed');
    const microbitController = getControllers().getMicrobitController();
    const microbitConnection = microbitController.getMicrobitConnectionState();
    const curConnClosed = microbitConnection.get();
    const oldOutputClosed = curConnClosed.getOutput();
    const newOutputClosed = new MicrobitConnectionStateImpl(
      false,
      false,
      false,
      oldOutputClosed ? oldOutputClosed.isOutdated() : false,
      oldOutputClosed ? oldOutputClosed.isInitializing() : false,
    );
    curConnClosed.setOutput(newOutputClosed);
    microbitController.setMicrobitConnection(curConnClosed);
  }

  public onClosedError(error: Error): void {
    throw new Error('Not sure what to do here');
  }
}

export default OutputMicrobitHandler;

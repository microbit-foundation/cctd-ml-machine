/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { MBSpecs, type MicrobitHandler } from 'microbyte';
import { buttonPressed } from '../stores/uiStore';
import TypingUtils from '../TypingUtils';
import { get } from 'svelte/store';
import MicrobitAccelerometerLiveData, {
  MicrobitAccelerometerDataVector,
} from '../livedata/MicrobitAccelerometerData';
import LiveDataBuffer from '../../core/LiveDataBuffer';
import StaticConfiguration from '../../StaticConfiguration';
import Microbits from './Microbits';
import { HexOrigin } from './HexOrigin';
import { stores } from '../stores/Stores';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import { onCatastrophicError } from '../utils/ErrorReconnect';
import type { MicrobitController } from '../../backend/interface-controller/MicrobitController';
import { MicrobitRole } from '../../backend/domain/microbit/MicrobitRole';
import { MicrobitConnectionStateImpl } from '../../backend/domain/implementation/microbit/MicrobitConnectionStateImpl';
import { MLMachine } from '../../backend/interface-adapter/MLMachine';

class InputMicrobitHandler implements MicrobitHandler {
  private reconnectTimeout = setTimeout(TypingUtils.emptyFunction, 0);
  private lastConnectedVersion: MBSpecs.MBVersion | undefined;

  public constructor(private microbitController: MicrobitController) {}

  public onConnected(versionNumber?: MBSpecs.MBVersion | undefined): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onConnected', versionNumber);

    clearTimeout(this.reconnectTimeout);
    const buffer = new LiveDataBuffer<MicrobitAccelerometerDataVector>(
      StaticConfiguration.accelerometerLiveDataBufferSize,
    );
    stores.setLiveData(new MicrobitAccelerometerLiveData(buffer));
    const microbitConnection = this.microbitController.getMicrobitConnectionState();
    const curConn = microbitConnection.get();
    const oldInput = curConn.getInput();
    const newInput = new MicrobitConnectionStateImpl(
      true,
      true,
      true,
      oldInput ? oldInput.isOutdated() : false,
      false,
    );
    curConn.setInput(newInput);
    this.microbitController.setMicrobitConnection(curConn);
    this.microbitController.clearReconnectOffering();
    this.lastConnectedVersion = versionNumber;
  }

  public onAccelerometerDataReceived(x: number, y: number, z: number): void {
    //Logger.log("InputMicrobitHandler", "onAccelerometerDataReceived", x, y, z);

    const accelX = x / 1000.0;
    const accelY = y / 1000.0;
    const accelZ = z / 1000.0;

    const liveDataStore = get(stores).liveData;
    if (liveDataStore !== undefined) {
      liveDataStore.put(
        new MicrobitAccelerometerDataVector({
          x: accelX,
          y: accelY,
          z: accelZ,
        }),
      );
    }
  }

  public onInitializing(): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onInitializing');

    const microbitConnection = this.microbitController.getMicrobitConnectionState();
    const curConnInit = microbitConnection.get();
    const oldInit = curConnInit.getInput();
    const newInit = new MicrobitConnectionStateImpl(
      oldInit ? oldInit.isConnected() : false,
      oldInit ? oldInit.isAssigned() : false,
      oldInit ? oldInit.isReady() : false,
      oldInit ? oldInit.isOutdated() : false,
      true,
    );
    curConnInit.setInput(newInit);
    this.microbitController.setMicrobitConnection(curConnInit);
    clearTimeout(this.reconnectTimeout);
    const onTimeout = () => onCatastrophicError(false);
    this.reconnectTimeout = setTimeout(function () {
      onTimeout();
    }, StaticConfiguration.reconnectTimeoutDuration);
  }

  public onButtonAPressed(state: MBSpecs.ButtonState): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onButtonAPressed', state);
    if (state === MBSpecs.ButtonStates.Released) return;
    buttonPressed.update(obj => {
      obj.buttonA = 1;
      obj.buttonB = 0;
      return obj;
    });
  }

  public onButtonBPressed(state: MBSpecs.ButtonState): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onButtonBPressed', state);
    if (state === MBSpecs.ButtonStates.Released) return;
    buttonPressed.update(obj => {
      obj.buttonA = 0;
      obj.buttonB = 1;
      return obj;
    });
  }

  public onMessageReceived(data: string): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onMessageReceived', data);
    if (data === 'id_mkcd') {
      Microbits.setInputOrigin(HexOrigin.MAKECODE);
      MLMachine.getInstance()
        .getControllers()
        .getOutputController()
        .setOutputTargetMakecode();
    }
    if (data === 'id_prop') {
      Microbits.setInputOrigin(HexOrigin.PROPRIETARY);
      // TODO: Maybe add ModelView.STACK here
    }

    if (data.includes('vi_')) {
      const version = parseInt(data.substring(3));
      const isOutdated = StaticConfiguration.isMicrobitOutdated(
        Microbits.getInputOrigin(),
        version,
      ); // TODO do something with this information
    }
  }

  public onDisconnected(): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onDisconnected');

    const microbitConnection = this.microbitController.getMicrobitConnectionState();
    const curConnDisc = microbitConnection.get();
    const oldDisc = curConnDisc.getInput();
    const newDisc = new MicrobitConnectionStateImpl(
      false,
      oldDisc ? oldDisc.isAssigned() : false,
      false,
      false,
      oldDisc ? oldDisc.isInitializing() : false,
    );
    curConnDisc.setInput(newDisc);
    this.microbitController.setMicrobitConnection(curConnDisc);
    this.microbitController.clearReconnectOffering();
  }

  public onReconnecting(): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onReconnecting');
    this.onConnecting();
  }

  public onReconnected(): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onReconnected');
    this.onConnected(this.lastConnectedVersion);
  }

  public onConnectError(error: Error): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onConnectError', error);

    const microbitConnection = this.microbitController.getMicrobitConnectionState();
    const curConnErr = microbitConnection.get();
    const oldErr = curConnErr.getInput();
    const newErr = new MicrobitConnectionStateImpl(
      false,
      false,
      false,
      oldErr ? oldErr.isOutdated() : false,
      oldErr ? oldErr.isInitializing() : false,
    );
    curConnErr.setInput(newErr);
    this.microbitController.setMicrobitConnection(curConnErr);
  }

  public onReconnectError(error: Error): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onReconnectError', error);
    this.onConnectError(error);

    this.microbitController.offerReconnect(MicrobitRole.INPUT);
  }

  public onClosed(): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onClosed');

    const microbitConnection = this.microbitController.getMicrobitConnectionState();
    const curConnClosed = microbitConnection.get();
    const oldClosed = curConnClosed.getInput();
    const newClosed = new MicrobitConnectionStateImpl(
      false,
      false,
      false,
      oldClosed ? oldClosed.isOutdated() : false,
      oldClosed ? oldClosed.isInitializing() : false,
    );
    curConnClosed.setInput(newClosed);
    this.microbitController.setMicrobitConnection(curConnClosed);
    clearTimeout(this.reconnectTimeout);
  }

  public onConnecting(): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onConnecting');
  }

  public onClosedError(error: Error): void {
    ConsoleLogger.log('InputMicrobitHandler', 'onClosedError', error);
    throw new Error('Not sure what to do here');
  }
}

export default InputMicrobitHandler;

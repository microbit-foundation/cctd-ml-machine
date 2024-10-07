/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { MBSpecs, MicrobitHandler } from 'microbyte';
import Logger from '../utils/Logger';
import { ModelView, buttonPressed, onCatastrophicError, state } from '../stores/uiStore';
import TypingUtils from '../TypingUtils';
import { get } from 'svelte/store';
import { stores } from '../stores/Stores';
import MicrobitAccelerometerLiveData, {
  MicrobitAccelerometerDataVector,
} from '../livedata/MicrobitAccelerometerData';
import LiveDataBuffer from '../domain/LiveDataBuffer';
import StaticConfiguration from '../../StaticConfiguration';
import { DeviceRequestStates } from '../stores/connectDialogStore';
import Microbits, { HexOrigin } from './Microbits';

class InputMicrobitHandler implements MicrobitHandler {
  private reconnectTimeout = setTimeout(TypingUtils.emptyFunction, 0);
  private lastConnectedVersion: MBSpecs.MBVersion | undefined;

  public onConnected(versionNumber?: MBSpecs.MBVersion | undefined): void {
    Logger.log('InputMicrobitHandler', 'onConnected', versionNumber);

    clearTimeout(this.reconnectTimeout);
    const buffer = new LiveDataBuffer<MicrobitAccelerometerDataVector>(
      StaticConfiguration.accelerometerLiveDataBufferSize,
    );
    stores.setLiveData(new MicrobitAccelerometerLiveData(buffer));

    state.update(s => {
      s.isInputConnected = true;
      s.isRequestingDevice = DeviceRequestStates.NONE;
      s.offerReconnect = false;
      s.isInputReady = true;
      s.isInputAssigned = true; // TODO: Maybe this should just be removed
      return s;
    });
    this.lastConnectedVersion = versionNumber;
  }

  public onAccelerometerDataReceived(x: number, y: number, z: number): void {
    //Logger.log("InputMicrobitHandler", "onAccelerometerDataReceived", x, y, z);

    const accelX = x / 1000.0;
    const accelY = y / 1000.0;
    const accelZ = z / 1000.0;

    get(stores).liveData.put(
      new MicrobitAccelerometerDataVector({
        x: accelX,
        y: accelY,
        z: accelZ,
      }),
    );
  }

  public onButtonAPressed(state: MBSpecs.ButtonState): void {
    if (state === MBSpecs.ButtonStates.Released) return;
    buttonPressed.update(obj => {
      obj.buttonA = 1;
      obj.buttonB = 0;
      return obj;
    });
  }

  public onButtonBPressed(state: MBSpecs.ButtonState): void {
    if (state === MBSpecs.ButtonStates.Released) return;
    buttonPressed.update(obj => {
      obj.buttonA = 0;
      obj.buttonB = 1;
      return obj;
    });
  }

  public onMessageReceived(data: string): void {
    //Logger.log("InputMicrobitHandler", "onMessageReceived", data);
    if (data === 'id_mkcd') {
      Microbits.setInputOrigin(HexOrigin.MAKECODE);
      state.update(s => {
        s.modelView = ModelView.TILE;
        return s;
      });
    }
    if (data === 'id_prop') {
      Microbits.setInputOrigin(HexOrigin.PROPRIETARY);
      // TODO: Maybe add ModelView.STACK here
    }

    if (data.includes('vi_')) {
      const version = parseInt(data.substring(3));
      Microbits.setInputBuildVersion(version);
      const isOutdated = StaticConfiguration.isMicrobitOutdated(
        Microbits.getInputOrigin(),
        version,
      ); // TODO do something with this information
    }
  }

  public onDisconnected(): void {
    state.update(s => {
      s.isInputConnected = false;
      s.offerReconnect = false;
      s.isInputReady = false;
      s.reconnectState = DeviceRequestStates.NONE;
      s.isInputOutdated = false;
      return s;
    });
  }

  public onReconnecting(): void {
    Logger.log('InputMicrobitHandler', 'onReconnecting');
    this.onConnecting();
  }

  public onReconnected(): void {
    Logger.log('InputMicrobitHandler', 'onReconnected');
    this.onConnected(this.lastConnectedVersion);
  }

  public onConnectError(error: Error): void {
    Logger.log('InputMicrobitHandler', 'onConnectError', error);
    state.update(s => {
      s.isInputConnected = false;
      s.isInputAssigned = false;
      s.isInputReady = false;
      return s;
    });
  }

  public onReconnectError(error: Error): void {
    Logger.log('InputMicrobitHandler', 'onReconnectError', error);
    this.onConnectError(error);
  }

  public onClosed(): void {
    state.update(s => {
      s.isInputConnected = false;
      s.isInputAssigned = false;
      s.isInputReady = false;
      //s.offerReconnect = true; // TODO: Maybe this should be implemented
      s.reconnectState = DeviceRequestStates.INPUT;
      return s;
    });
    clearTimeout(this.reconnectTimeout);
  }

  public onConnecting(): void {
    // Works like this: If the MB manages to connect, wait `reconnectTimeoutDuration` milliseconds
    // if MB does not call onReady before that expires, refresh the page
    clearTimeout(this.reconnectTimeout);
    const onTimeout = () => onCatastrophicError(false); // TODO: Replace false, with a check for presence of a name
    this.reconnectTimeout = setTimeout(function () {
      onTimeout();
    }, StaticConfiguration.reconnectTimeoutDuration);
  }

  public onClosedError(error: Error): void {
    throw new Error('Not sure what to do here');
  }
}

export default InputMicrobitHandler;

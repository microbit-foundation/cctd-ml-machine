/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { MBSpecs, type MicrobitHandler } from 'microbyte';
import Logger from '../utils/Logger';
import { buttonPressed, onCatastrophicError } from '../stores/uiStore';
import TypingUtils from '../TypingUtils';
import { get } from 'svelte/store';
import MicrobitAccelerometerLiveData, {
  MicrobitAccelerometerDataVector,
} from '../livedata/MicrobitAccelerometerData';
import LiveDataBuffer from '../domain/LiveDataBuffer';
import StaticConfiguration from '../../StaticConfiguration';
import Microbits from './Microbits';
import { HexOrigin } from './HexOrigin';
import { stores } from '../stores/Stores';
import Devices, { DeviceRequestStates } from '../domain/Devices';
import { ModelView, modelView } from '../stores/ApplicationState';

class InputMicrobitHandler implements MicrobitHandler {
  private reconnectTimeout = setTimeout(TypingUtils.emptyFunction, 0);
  private lastConnectedVersion: MBSpecs.MBVersion | undefined;

  public constructor(private devices: Devices) {}

  public onConnected(versionNumber?: MBSpecs.MBVersion | undefined): void {
    Logger.log('InputMicrobitHandler', 'onConnected', versionNumber);

    clearTimeout(this.reconnectTimeout);
    const buffer = new LiveDataBuffer<MicrobitAccelerometerDataVector>(
      StaticConfiguration.accelerometerLiveDataBufferSize,
    );
    stores.setLiveData(new MicrobitAccelerometerLiveData(buffer));

    this.devices.update(s => {
      s.isInputConnected = true;
      s.isRequestingDevice = DeviceRequestStates.NONE;
      s.offerReconnect = false;
      s.isInputInitializing = false;
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
    Logger.log('InputMicrobitHandler', 'onInitializing');
    this.devices.update(s => {
      s.isInputInitializing = true;
      return s;
    });
    clearTimeout(this.reconnectTimeout);
    const onTimeout = () => onCatastrophicError(false);
    this.reconnectTimeout = setTimeout(function () {
      onTimeout();
    }, StaticConfiguration.reconnectTimeoutDuration);
  }

  public onButtonAPressed(state: MBSpecs.ButtonState): void {
    Logger.log('InputMicrobitHandler', 'onButtonAPressed', state);
    if (state === MBSpecs.ButtonStates.Released) return;
    buttonPressed.update(obj => {
      obj.buttonA = 1;
      obj.buttonB = 0;
      return obj;
    });
  }

  public onButtonBPressed(state: MBSpecs.ButtonState): void {
    Logger.log('InputMicrobitHandler', 'onButtonBPressed', state);
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
      modelView.set(ModelView.TILE);
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
    Logger.log('InputMicrobitHandler', 'onDisconnected');
    this.devices.update(s => {
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
    this.devices.update(s => {
      s.isInputConnected = false;
      s.isInputAssigned = false;
      s.isInputReady = false;
      return s;
    });
  }

  public onReconnectError(error: Error): void {
    Logger.log('InputMicrobitHandler', 'onReconnectError', error);
    this.onConnectError(error);
    this.devices.update(s => {
      s.offerReconnect = true;
      s.reconnectState = DeviceRequestStates.INPUT;
      return s;
    });
  }

  public onClosed(): void {
    Logger.log('InputMicrobitHandler', 'onClosed');
    this.devices.update(s => {
      s.isInputConnected = false;
      s.isInputAssigned = false;
      s.isInputReady = false;
      return s;
    });
    clearTimeout(this.reconnectTimeout);
  }

  public onConnecting(): void {
    Logger.log('InputMicrobitHandler', 'onConnecting');
  }

  public onClosedError(error: Error): void {
    Logger.log('InputMicrobitHandler', 'onClosedError', error);
    throw new Error('Not sure what to do here');
  }
}

export default InputMicrobitHandler;

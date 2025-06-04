import {
  get,
  writable,
  type Invalidator,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable,
} from 'svelte/store';

export enum DeviceRequestStates {
  NONE,
  INPUT,
  OUTPUT,
}

interface DevicesType {
  isRequestingDevice: DeviceRequestStates;
  isFlashingDevice: boolean;

  /**
   * @deprecated should be moved to the 'Recorder' store
   */
  isRecording: boolean;
  isInputConnected: boolean;
  isOutputConnected: boolean;
  offerReconnect: boolean;
  requestDeviceWasCancelled: boolean;
  reconnectState: DeviceRequestStates;
  isInputReady: boolean;
  isInputAssigned: boolean;
  isOutputAssigned: boolean;
  isOutputReady: boolean;
  isInputInitializing: boolean;
  isInputOutdated: boolean;
  isOutputOutdated: boolean;
}

class Devices implements Writable<DevicesType> {
  private store: Writable<DevicesType>;

  public constructor() {
    this.store = writable({
      isRequestingDevice: DeviceRequestStates.NONE,
      isFlashingDevice: false,
      isRecording: false,
      isInputConnected: false,
      isOutputConnected: false,
      offerReconnect: false,
      requestDeviceWasCancelled: false,
      reconnectState: DeviceRequestStates.NONE,
      isInputReady: false,
      isInputAssigned: false,
      isOutputAssigned: false,
      isOutputReady: false,
      isInputInitializing: false,
      isInputOutdated: false,
      isOutputOutdated: false,
    });
  }

  public set(value: DevicesType): void {
    this.store.set(value);
  }

  public update(updater: Updater<DevicesType>): void {
    this.set(updater(get(this.store)));
  }

  public subscribe(
    run: Subscriber<DevicesType>,
    invalidate?: Invalidator<DevicesType> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}
export default Devices;

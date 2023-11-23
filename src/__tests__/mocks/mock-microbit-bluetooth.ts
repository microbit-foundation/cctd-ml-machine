/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import MBSpecs from '../../script/microbit-interfacing/MBSpecs';
import MockInfoService, {
  MockBluetoothModelNumberCharacteristic,
} from './mock-bluetooth-info-service';
import MockBluetoothAccelerometerService from './mock-bluetooth-accelerometer-service';
import MockBluetoothGattservice from './mock-bluetooth-gattservice';

class MockBTDevice implements BluetoothDevice {
  readonly id: string = '';
  readonly watchingAdvertisements: boolean = false;
  public gatt: BluetoothRemoteGATTServer;
  public willFailConnection = false;
  private microbitVersion = 0;
  private listeners: DeviceListener[] = [];

  constructor() {
    this.gatt = new MockGattServer(this, this);
  }

  public withMicrobitVersion(versionNumber: 1 | 2) {
    this.microbitVersion = versionNumber;
    return this;
  }

  public withFailingConnection() {
    this.willFailConnection = true;
    return this;
  }

  public build() {
    let gatt = new MockGattServer(this, this);
    if (!this.microbitVersion) {
      this.microbitVersion = 1;
    }
    let deviceInfoService = new MockInfoService(this);
    const modelNumberCharacteristic = new MockBluetoothModelNumberCharacteristic(
      this.microbitVersion,
      deviceInfoService,
    );
    deviceInfoService = deviceInfoService.withModelNumber(modelNumberCharacteristic);
    gatt = gatt.withDeviceInfo(deviceInfoService);
    this.gatt = gatt;
    return this;
  }

  onadvertisementreceived(ev: BluetoothAdvertisingEvent): any {
    /* Empty */
  }

  oncharacteristicvaluechanged(ev: Event): any {
    /* Empty */
  }

  ongattserverdisconnected(ev: Event): any {
    /* Empty */
  }

  onserviceadded(ev: Event): any {
    /* Empty */
  }

  onservicechanged(ev: Event): any {
    /* Empty */
  }

  onserviceremoved(ev: Event): any {
    /* Empty */
  }

  addEventListener(
    type: 'gattserverdisconnected',
    listener: (this: this, ev: Event) => any,
    useCapture?: boolean,
  ): void;
  addEventListener(
    type: 'advertisementreceived',
    listener: (this: this, ev: BluetoothAdvertisingEvent) => any,
    useCapture?: boolean,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean,
  ): void;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void;
  addEventListener(
    type: 'gattserverdisconnected' | 'advertisementreceived' | string,
    listener:
      | ((this: this, ev: Event) => any)
      | ((this: this, ev: BluetoothAdvertisingEvent) => any)
      | EventListenerOrEventListenerObject
      | null,
    useCapture?: boolean | AddEventListenerOptions,
  ): void {
    this.listeners.push({ eventType: type, listener: listener });
  }

  dispatchEvent(event: Event): boolean;
  dispatchEvent(event: Event): boolean;
  dispatchEvent(event: Event): boolean {
    this.listeners.forEach(value => {
      if (event.type == value.eventType) {
        if (value.listener) {
          value.listener(value);
        }
      }
    });
    return false;
  }

  forget(): Promise<void> {
    return Promise.resolve(undefined);
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    /* Empty */
  }

  watchAdvertisements(options?: WatchAdvertisementsOptions): Promise<void> {
    return Promise.resolve(undefined);
  }
}

class MockGattServer implements BluetoothRemoteGATTServer {
  connected: boolean;
  readonly device: BluetoothDevice;
  mockDevice: MockBTDevice;
  deviceInfoService: BluetoothRemoteGATTService;
  accelerometerService: BluetoothRemoteGATTService;

  constructor(device: BluetoothDevice, mock: MockBTDevice) {
    this.connected = false;
    this.device = device;
    this.mockDevice = mock;
    this.deviceInfoService = new MockInfoService(device);
    this.accelerometerService = new MockBluetoothAccelerometerService(device);
  }

  withDeviceInfo(deviceInfoService: BluetoothRemoteGATTService) {
    this.deviceInfoService = deviceInfoService;
    return this;
  }

  connect(): Promise<BluetoothRemoteGATTServer> {
    if (this.mockDevice.willFailConnection) {
      return Promise.reject(undefined);
    }
    this.connected = true;
    return Promise.resolve(this);
  }

  disconnect(): void {
    this.device.dispatchEvent(new Event('gattserverdisconnected'));
    this.connected = false;
  }

  getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService> {
    if (service === MBSpecs.Services.DEVICE_INFO_SERVICE) {
      return Promise.resolve(this.deviceInfoService);
    }
    if (service === MBSpecs.Services.ACCEL_SERVICE) {
      return Promise.resolve(this.accelerometerService);
    }
    if (service === MBSpecs.Services.BUTTON_SERVICE) {
      return Promise.resolve(new MockBluetoothGattservice(this.device));
    }
    if (service === MBSpecs.Services.UART_SERVICE) {
      return Promise.resolve(new MockBluetoothGattservice(this.device));
    }
    console.warn(
      'The primary service, you tried to fetch were unknown. Was this on purpose?',
    );
    return Promise.reject(undefined);
  }

  getPrimaryServices(
    service?: BluetoothServiceUUID,
  ): Promise<BluetoothRemoteGATTService[]> {
    return Promise.resolve([]);
  }
}

type DeviceListener = {
  eventType: 'gattserverdisconnected' | 'advertisementreceived' | string;
  listener: any;
};

export default MockBTDevice;

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import MBSpecs from '../../script/microbit-interfacing/MBSpecs';
import { MockBluetoothCharacteristicProperties } from './mock-bluetooth';

class MockBluetoothAccelerometerService implements BluetoothRemoteGATTService {
  readonly device: BluetoothDevice;
  readonly isPrimary: boolean = false;
  readonly uuid: string = '';
  private characteristic;

  constructor(device: any) {
    this.device = device;
    this.characteristic = new MockBluetoothAccelerometerCharacteristic(this);
  }

  oncharacteristicvaluechanged(ev: Event): any {}

  onserviceadded(ev: Event): any {}

  onservicechanged(ev: Event): any {}

  onserviceremoved(ev: Event): any {}

  addEventListener(
    type: 'serviceadded',
    listener: (this: this, ev: Event) => any,
    useCapture?: boolean,
  ): void;
  addEventListener(
    type: 'servicechanged',
    listener: (this: this, ev: Event) => any,
    useCapture?: boolean,
  ): void;
  addEventListener(
    type: 'serviceremoved',
    listener: (this: this, ev: Event) => any,
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
    type: 'serviceadded' | 'servicechanged' | 'serviceremoved' | string,
    listener:
      | ((this: this, ev: Event) => any)
      | EventListenerOrEventListenerObject
      | null,
    useCapture?: boolean | AddEventListenerOptions,
  ): void {}

  dispatchEvent(event: Event): boolean;
  dispatchEvent(event: Event): boolean;
  dispatchEvent(event: Event): boolean {
    return false;
  }

  getCharacteristic(
    characteristic: BluetoothCharacteristicUUID,
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    if (characteristic === MBSpecs.Characteristics.ACCEL_DATA) {
      return Promise.resolve(this.characteristic);
    }
    return Promise.resolve(this.characteristic); // always returns characteristic
  }

  getCharacteristics(
    characteristic?: BluetoothCharacteristicUUID,
  ): Promise<BluetoothRemoteGATTCharacteristic[]> {
    return Promise.resolve([]);
  }

  getIncludedService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService> {
    return Promise.resolve(this);
  }

  getIncludedServices(
    service?: BluetoothServiceUUID,
  ): Promise<BluetoothRemoteGATTService[]> {
    return Promise.resolve([]);
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
  ): void {}
}

export class MockBluetoothAccelerometerCharacteristic
  implements BluetoothRemoteGATTCharacteristic
{
  readonly properties: BluetoothCharacteristicProperties =
    new MockBluetoothCharacteristicProperties();
  readonly service: BluetoothRemoteGATTService;
  readonly uuid: string = '';

  constructor(service: BluetoothRemoteGATTService) {
    this.service = service;
  }

  oncharacteristicvaluechanged(ev: Event): any {}

  addEventListener(
    type: 'characteristicvaluechanged',
    listener: (this: this, ev: Event) => any,
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
    type: 'characteristicvaluechanged' | string,
    listener:
      | ((this: this, ev: Event) => any)
      | EventListenerOrEventListenerObject
      | null,
    useCapture?: boolean | AddEventListenerOptions,
  ): void {}

  dispatchEvent(event: Event): boolean;
  dispatchEvent(event: Event): boolean;
  dispatchEvent(event: Event): boolean {
    return false;
  }

  getDescriptor(
    descriptor: BluetoothDescriptorUUID,
  ): Promise<BluetoothRemoteGATTDescriptor> {
    return Promise.resolve(undefined as unknown as BluetoothRemoteGATTDescriptor);
  }

  getDescriptors(
    descriptor?: BluetoothDescriptorUUID,
  ): Promise<BluetoothRemoteGATTDescriptor[]> {
    return Promise.resolve([]);
  }

  readValue(): Promise<DataView> {
    return Promise.resolve(undefined as unknown as DataView);
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
  ): void {}

  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic> {
    return Promise.resolve(undefined as unknown as BluetoothRemoteGATTCharacteristic);
  }

  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic> {
    return Promise.resolve(undefined as unknown as BluetoothRemoteGATTCharacteristic);
  }

  writeValue(value: BufferSource): Promise<void> {
    return Promise.resolve(undefined);
  }

  writeValueWithResponse(value: BufferSource): Promise<void> {
    return Promise.resolve(undefined);
  }

  writeValueWithoutResponse(value: BufferSource): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export default MockBluetoothAccelerometerService;

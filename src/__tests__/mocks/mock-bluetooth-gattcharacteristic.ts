/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

class MockBluetoothCharacteristicProperties implements BluetoothCharacteristicProperties {
  readonly authenticatedSignedWrites: boolean = false;
  readonly broadcast: boolean = false;
  readonly indicate: boolean = false;
  readonly notify: boolean = false;
  readonly read: boolean = false;
  readonly reliableWrite: boolean = false;
  readonly writableAuxiliaries: boolean = false;
  readonly write: boolean = false;
  readonly writeWithoutResponse: boolean = false;
}

class MockBluetoothGattcharacteristic implements BluetoothRemoteGATTCharacteristic {
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

export default MockBluetoothGattcharacteristic;

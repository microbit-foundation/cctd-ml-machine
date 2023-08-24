/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import USBConfiguration from 'dapjs';
import USBInterface from 'dapjs';
import USBAlternateInterface from 'dapjs';
import MicrobitUSB from '../../script/microbit-interfacing/MicrobitUSB';

class SimpleUSBInterfaceAlternate implements USBAlternateInterface {
  alternateSetting = 0;
  interfaceClass = 0;
  interfaceSubclass = 0;
  interfaceProtocol = 0;
  interfaceName?: string;
  endpoints: USBEndpoint[] = [];
}

class SimpleUSBInterface implements USBInterface {
  interfaceNumber: number;
  alternate: USBAlternateInterface;
  alternates: USBAlternateInterface[] = [];
  claimed = false;

  constructor() {
    this.alternate = new SimpleUSBInterfaceAlternate();
    this.interfaceNumber = 1;
  }
}

class SimpleUSBConfig implements USBConfiguration {
  configurationValue: number;
  configurationName?: string;
  interfaces: USBInterface[];

  constructor() {
    this.configurationName = 'some name';
    this.configurationValue = 1;
    this.interfaces = [];
    this.interfaces.push(new SimpleUSBInterface());
  }
}

class MockUSBDevice implements USBDevice {
  configurations: USBConfiguration[] = [];
  readonly deviceClass: number = 0;
  readonly deviceProtocol: number = 0;
  readonly deviceSubclass: number = 0;
  readonly deviceVersionMajor: number = 0;
  readonly deviceVersionMinor: number = 0;
  readonly deviceVersionSubminor: number = 0;
  readonly opened: boolean = false;
  readonly productId: number = 0;
  readonly usbVersionMajor: number = 0;
  readonly usbVersionMinor: number = 0;
  readonly usbVersionSubminor: number = 0;
  readonly vendorId: number = 0;
  interfaceNumber = 0;
  public serialNumber = '';

  public withSerialNumber(serno: string) {
    this.serialNumber = serno;
    return this;
  }

  public build() {
    this.configurations = [];
    const usbConfig = new SimpleUSBConfig();
    this.configurations = [usbConfig];
    this.interfaceNumber = 1;
    return this;
  }

  claimInterface(interfaceNumber: number): Promise<void> {
    return Promise.resolve();
  }

  clearHalt(direction: USBDirection, endpointNumber: number): Promise<void> {
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }

  controlTransferIn(
    setup: USBControlTransferParameters,
    length: number,
  ): Promise<USBInTransferResult> {
    return Promise.resolve(new USBInTransferResult('ok', undefined));
  }

  controlTransferOut(
    setup: USBControlTransferParameters,
    data?: BufferSource,
  ): Promise<USBOutTransferResult> {
    return Promise.resolve(new USBOutTransferResult('ok', 1));
  }

  forget(): Promise<void> {
    return Promise.resolve();
  }

  isochronousTransferIn(
    endpointNumber: number,
    packetLengths: number[],
  ): Promise<USBIsochronousInTransferResult> {
    return Promise.resolve(new USBIsochronousInTransferResult([], undefined));
  }

  isochronousTransferOut(
    endpointNumber: number,
    data: BufferSource,
    packetLengths: number[],
  ): Promise<USBIsochronousOutTransferResult> {
    return Promise.resolve(new USBIsochronousOutTransferResult([]));
  }

  open(): Promise<void> {
    return Promise.resolve();
  }

  releaseInterface(interfaceNumber: number): Promise<void> {
    return Promise.resolve();
  }

  reset(): Promise<void> {
    return Promise.resolve();
  }

  selectAlternateInterface(
    interfaceNumber: number,
    alternateSetting: number,
  ): Promise<void> {
    return Promise.resolve();
  }

  selectConfiguration(configurationValue: number): Promise<void> {
    return Promise.resolve();
  }

  transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult> {
    return Promise.resolve(new USBInTransferResult('ok', undefined));
  }

  transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult> {
    return Promise.resolve(new USBOutTransferResult('ok', 1));
  }
}

export default MockUSBDevice;

export class TestableMicrobitUSB extends MicrobitUSB {
  /** Just overrides the protected constructor to be able to use the Mock USB device to test */
  public constructor(usbDevice: USBDevice) {
    super(usbDevice);
  }
}

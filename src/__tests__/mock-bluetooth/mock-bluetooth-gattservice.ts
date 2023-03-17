import MockBluetoothGattcharacteristic from "./mock-bluetooth-gattcharacteristic";

class MockBluetoothGattservice implements BluetoothRemoteGATTService {
	readonly device: BluetoothDevice;
	readonly isPrimary: boolean = false;
	readonly uuid: string = "";

	constructor(device: BluetoothDevice) {
		this.device = device;
	}

	oncharacteristicvaluechanged(ev: Event): any {
	}

	onserviceadded(ev: Event): any {
	}

	onservicechanged(ev: Event): any {
	}

	onserviceremoved(ev: Event): any {
	}

	addEventListener(type: "serviceadded", listener: (this: this, ev: Event) => any, useCapture?: boolean): void;
	addEventListener(type: "servicechanged", listener: (this: this, ev: Event) => any, useCapture?: boolean): void;
	addEventListener(type: "serviceremoved", listener: (this: this, ev: Event) => any, useCapture?: boolean): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
	addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
	addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
	addEventListener(type: "serviceadded" | "servicechanged" | "serviceremoved" | string, listener: ((this: this, ev: Event) => any) | EventListenerOrEventListenerObject | null, useCapture?: boolean | AddEventListenerOptions): void {
	}

	dispatchEvent(event: Event): boolean;
	dispatchEvent(event: Event): boolean;
	dispatchEvent(event: Event): boolean {
		return false;
	}

	getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic> {
		return Promise.resolve(new MockBluetoothGattcharacteristic(this));
	}

	getCharacteristics(characteristic?: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic[]> {
		return Promise.resolve([]);
	}

	getIncludedService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService> {
		return Promise.resolve(undefined as unknown as BluetoothRemoteGATTService);
	}

	getIncludedServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]> {
		return Promise.resolve([]);
	}

	removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
	removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
	removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {
	}
}

export default MockBluetoothGattservice;
/**
 * @jest-environment jsdom
 */
import "svelte-jester";
import EventEmittingMicrobitBluetooth from "../script/microbit-interfacing/EventEmittingMicrobitBluetooth";
import MockBTDevice from "./mock-bluetooth/mock-microbit-bluetooth";

describe("Microbit Bluetooth event emission tests", () => {

	beforeAll(() => {
		console.warn("Warning: Using requestDevice on any micro:bit that is not named 'vatav', will result in rejection.");
		/** Adds the bluetooth property to the navigator for mocking */
		Object.assign(navigator, {
			bluetooth: {
				requestDevice(options?: RequestDeviceOptions & { filters?: any | any[] }): Promise<BluetoothDevice> {
					const microBitName = "vatav";
					if (!options) {
						return Promise.reject(undefined);
					}
					if (!options.filters) {
						return Promise.reject(undefined);
					}
					if (options.filters.length == 0) {
						return Promise.reject(undefined);
					}
					if (!options.filters[0].namePrefix) {
						return Promise.reject(undefined);
					}
					if (options.filters[0].namePrefix !== `BBC micro:bit [${microBitName}]`) {
						return Promise.reject(undefined);
					}
					return Promise.resolve(new MockBTDevice().build());
				}
			}
		});
	});

	test("Request device event is dispatched when device is found", async () => {
		let didFire = false;

		document.addEventListener("microbitBluetoothDeviceFound", () => {
			didFire = true;
		});

		await EventEmittingMicrobitBluetooth.eventEmittingRequestDevice("vatav");

		expect(didFire).toBeTruthy();
	});


	test("Device found event is not fired, if no device is found", async () => {
		let didFire = false;

		document.addEventListener("microbitBluetoothDeviceFound", () => {
			didFire = true;
		});

		try {
			const device = await EventEmittingMicrobitBluetooth.eventEmittingRequestDevice("not a microbit here");
			expect(device).not.toBeDefined();
		} catch (e) {
		}
		expect(didFire).toBeFalsy();
	});


	test("Bluetooth connected event is fired when connected", async () => {
		let didFire = false;

		document.addEventListener("microbitBluetoothConnected", () => {
			didFire = true;
		});

		const device = new MockBTDevice().build();
		await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);

		expect(didFire).toBeTruthy();
	});


	test("Bluetooth connected event is NOT fired when connection fails", async () => {
		let didFire = false;

		document.addEventListener("microbitBluetoothConnected", () => {
			didFire = true;
		});
		try {
			const device = new MockBTDevice().withFailingConnection().build();
			await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);
		} catch (e) {

		}

		expect(didFire).toBeFalsy();
	});


	test("Bluetooth disconnect event is NOT fired when connection fails", async () => {
		let didFire = false;

		document.addEventListener("microbitBluetoothDisconnected", () => {
			didFire = true;
		});

		try {
			const device = new MockBTDevice().withFailingConnection().build();
			await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);
		} catch (e) {

		}

		expect(didFire).toBeFalsy();
	});


	test("Bluetooth disconnect event is NOT fired when connection succeeds and stays connected", async () => {
		let didFire = false;

		document.addEventListener("microbitBluetoothDisconnected", () => {
			didFire = true;
		});

		const device = new MockBTDevice().build();
		await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);

		expect(didFire).toBeFalsy();
	});


	test("Disconnect event should be fired when disconnected", async () => {
		let didFire = false;

		document.addEventListener("microbitBluetoothDisconnected", () => {
			didFire = true;
		});

		const device = new MockBTDevice().build();
		const con = await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);
		con.disconnect();

		expect(didFire).toBeTruthy();
	});


	test("Disconnect event should be fired twice when disconnected twice", async () => {
		let fireCount = 0;

		document.addEventListener("microbitBluetoothDisconnected", () => {
			fireCount += 1;
		});

		const device = new MockBTDevice().build();
		const con1 = await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);
		con1.disconnect();
		const con2 = await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);
		con2.disconnect();

		expect(fireCount).toBe(2);
	});

	test("Connection event should fire twice when connected twice", async () => {
		let fireCount = 0;

		document.addEventListener("microbitBluetoothConnected", () => {
			fireCount += 1;
		});

		const device = new MockBTDevice().build();
		await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);
		await EventEmittingMicrobitBluetooth.createEventEmittingConnection(device);

		expect(fireCount).toBe(2);
	});

	test("device found should contain instance of bluetooth device", async () => {
		let didFire = false;
		// @ts-ignore
		document.addEventListener("microbitBluetoothDeviceFound", (evt: CustomEvent & { detail: any }) => {
			expect(evt.detail.bluetoothDevice).toBeDefined();
			expect(typeof evt.detail.bluetoothDevice).toBe("object");
			expect(evt.detail.bluetoothDevice.constructor.name).toBe("MockBTDevice");
			didFire = true;
		});
		await EventEmittingMicrobitBluetooth.eventEmittingRequestDevice("vatav");
		expect(didFire).toBeTruthy();
	});
});

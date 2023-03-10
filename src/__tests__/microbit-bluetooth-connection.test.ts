/**
 * @jest-environment jsdom
 */
import "svelte-jester";
import MicrobitBluetooth from "../script/microbit-interfacing/MicrobitBluetooth";
import MockBTDevice from "./mocks/mock-microbit-bluetooth";

describe("Microbit Bluetooth interface tests", () => {

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

	test("can create connection", async () => {
		const mockBt = new MockBTDevice().withMicrobitVersion(2).build();
		const con = await MicrobitBluetooth.createConnection(mockBt);
		expect(con).toBeDefined();
	});

	test("Can read version", async () => {
		const mockBt1 = new MockBTDevice().withMicrobitVersion(1).build();
		const con1 = await MicrobitBluetooth.createConnection(mockBt1);
		expect(con1.getVersion()).toBe(1);

		const mockBt2 = new MockBTDevice().withMicrobitVersion(2).build();
		const con2 = await MicrobitBluetooth.createConnection(mockBt2);
		expect(con2.getVersion()).toBe(2);
	});

	test("On connect fires when connected", async () => {
		const mockBt = new MockBTDevice().build();
		let didFire = false;
		await MicrobitBluetooth.createConnection(mockBt, () => didFire = true
		);
		expect(didFire).toBe(true);
	});

	test("onConnect does not fire when connection fails", async () => {
		const mockBt = new MockBTDevice().withFailingConnection().build();
		let didFire = false;
		try {
			await MicrobitBluetooth.createConnection(mockBt, () => didFire = true
			);

		} catch (e) {

		}
		expect(didFire).toBe(false);
	});

	test("onConnectFailed is fired when connection fails", async () => {
		const mockBt = new MockBTDevice().withFailingConnection().build();
		let didFire = false;
		try {
			await MicrobitBluetooth.createConnection(
				mockBt,
				void 0,
				void 0,
				() => didFire = true
			);
		} catch (e) {

		}
		expect(didFire).toBe(true);
	});

	test("onConnectFailed does not fire when connection succeeds", async () => {
		const mockBt: BluetoothDevice = new MockBTDevice().build();
		let didFire = false;
		await MicrobitBluetooth.createConnection(
			mockBt,
			void 0,
			void 0,
			() => didFire = true
		);

		expect(didFire).toBe(false);
	});

	test("onDisconnect fires when gatt is disconnected", async () => {
		const mockBt: BluetoothDevice = new MockBTDevice().build();
		let didFire = false;
		await MicrobitBluetooth.createConnection(
			mockBt,
			void 0,
			() => {
				didFire = true;
			}
		);

		mockBt.gatt!.disconnect();

		expect(didFire).toBe(true);
	});

	test("Request device yields device", async () => {
		const device = await MicrobitBluetooth.requestDevice("vatav");
		expect(device).toBeDefined();
	});

	test("Can connect to requested device", async () => {
		const device = await MicrobitBluetooth.requestDevice("vatav");

		const con = await MicrobitBluetooth.createConnection(device);
		expect(con).toBeDefined();
		expect(con.isConnected()).toBe(true);
	});
});

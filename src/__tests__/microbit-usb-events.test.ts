/**
 * @jest-environment jsdom
 */
import "svelte-jester";
import MockUSBDevice from "./mock-bluetooth/mock-usb";
import EventEmittingMicrobitUSB from "../script/microbit-interfacing/EventEmittingMicrobitUSB";

describe("Microbit USB event tests", () => {

	beforeEach(() => {
		/** Adds the usb property to the navigator for mocking */
		Object.assign(navigator, {
			usb: {
				requestDevice(options?: USBDeviceRequestOptions): Promise<USBDevice> {
					return Promise.resolve(new MockUSBDevice().build());
				}
			}
		});
		Object.assign(global, {
			fetch: (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
				const response = new class implements Response {
					readonly body: ReadableStream<Uint8Array> | null = null;
					readonly bodyUsed: boolean = false;
					readonly headers: Headers = new Headers();
					readonly ok: boolean = false;
					readonly redirected: boolean = false;
					readonly status: number = 0;
					readonly statusText: string = "";
					readonly type: ResponseType = "basic";
					readonly url: string = "";

					arrayBuffer(): Promise<ArrayBuffer> {
						return Promise.resolve(new ArrayBuffer(1));
					}

					blob(): Promise<Blob> {
						return Promise.resolve(new Blob());
					}

					clone(): Response {
						return new Response();
					}

					formData(): Promise<FormData> {
						return Promise.resolve(new FormData());
					}

					json(): Promise<any> {
						return Promise.resolve(undefined);
					}

					text(): Promise<string> {
						return Promise.resolve("");
					}

				};
				return Promise.resolve(response);
			}
		});
	});

	test("Found USB device emits device found event", async () => {
		let didFire = false;
		document.addEventListener("microbitUSBDeviceFound", () => {
			didFire = true;
		});

		await EventEmittingMicrobitUSB.eventEmittingRequestConnection();

		expect(didFire).toBeTruthy();
	});

	test("Not finding USB device, should not cause device found to be triggered", async () => {
		let didFire = false;
		document.addEventListener("microbitUSBDeviceFound", () => {
			didFire = true;
		});

		Object.assign(navigator, {
			usb: {
				requestDevice(options?: USBDeviceRequestOptions): Promise<USBDevice> {
					throw Error("This an error thrown explicitly");
				}
			}
		});
		try {
			await EventEmittingMicrobitUSB.eventEmittingRequestConnection();
		} catch (e) {

		}

		expect(didFire).toBeFalsy();
	});

	test("Rejection should not cause the microbit device found event to be triggered", async () => {
		let didFire = false;
		document.addEventListener("microbitUSBDeviceFound", () => {
			didFire = true;
		});

		Object.assign(navigator, {
			usb: {
				requestDevice(options?: USBDeviceRequestOptions): Promise<USBDevice> {
					return Promise.reject(undefined);
				}
			}
		});
		try {
			await EventEmittingMicrobitUSB.eventEmittingRequestConnection();

		} catch (e) {

		}

		expect(didFire).toBeFalsy();
	});

	test("Finding device should cause the device found event to be triggered", async () => {
		let didFire = false;
		document.addEventListener("microbitUSBDeviceFound", () => {
			didFire = true;
		});

		await EventEmittingMicrobitUSB.eventEmittingRequestConnection();

		expect(didFire).toBeTruthy();
	});

	test("Successful connection should cause the connection succeeded event to be fired", async () => {
		let didFire = false;
		document.addEventListener("microbitUSBConnected", () => {
			didFire = true;
		});

		await EventEmittingMicrobitUSB.eventEmittingRequestConnection();

		expect(didFire).toBeTruthy();
	});

	test("No successful connection should not cause the microbit connected event to be fired", async () => {
		let didFire = false;
		document.addEventListener("microbitUSBConnected", () => {
			didFire = true;
		});
		Object.assign(navigator, {
			usb: {
				requestDevice(options?: USBDeviceRequestOptions): Promise<USBDevice | undefined> {
					return Promise.resolve(undefined);
				}
			}
		});
		try {
			await EventEmittingMicrobitUSB.eventEmittingRequestConnection();

		} catch (e) {

		}

		expect(didFire).toBeFalsy();
	});

	test("Connection rejected should not cause the microbit connected event to be fired", async () => {
		let didFire = false;
		document.addEventListener("microbitUSBConnected", () => {
			didFire = true;
		});
		Object.assign(navigator, {
			usb: {
				requestDevice(options?: USBDeviceRequestOptions): Promise<USBDevice> {
					return Promise.reject(undefined);
				}
			}
		});
		try {
			await EventEmittingMicrobitUSB.eventEmittingRequestConnection();

		} catch (e) {

		}

		expect(didFire).toBeFalsy();
	});

	test("Flashing causes flash events to be fired", async () => {
		let didFire1 = false;
		document.addEventListener("microbitUSBFlashBegin", () => {
			didFire1 = true;
		});

		const connection = await EventEmittingMicrobitUSB.eventEmittingRequestConnection();

		try {
			await connection!.flashHex("firmware/ml-microbit-cpp-version-combined.hex", () => {
			});
		} catch (e) {
		}
		expect(didFire1).toBeTruthy();
	});

});

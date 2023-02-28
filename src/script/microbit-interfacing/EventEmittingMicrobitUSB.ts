import MBSpecs from "./MBSpecs";
import MicrobitUSB from "./MicrobitUSB";

type MicrobitUSBEvents =
	"microbitUSBConnected" |
	"microbitUSBFlashBegin" |
	"microbitUSBFlashEnd"

type USBConnectEvents = "microbitUSBDeviceFound"

type USBConnectEventData = Event |
	{ detail: { usbDevice: USBDevice } }

type MicrobitUSBEventData = Event |
	{ detail: { usbDevice: EventEmittingMicrobitUSB } }

export class MicrobitUSBEvent {
	public static createMicrobitEvent(event: MicrobitUSBEvents, device: EventEmittingMicrobitUSB): CustomEvent {
		switch (event) {
			case "microbitUSBConnected":
				return MicrobitUSBEvent.microbitUSBConnected(device);
			case "microbitUSBFlashBegin":
				return MicrobitUSBEvent.microbitUSBFlashBegin(device);
			case "microbitUSBFlashEnd":
				return MicrobitUSBEvent.microbitUSBFlashEnd(device);
		}
		throw Error("Could not find constructor for the given event");
	}

	public static createUSBConnectEvent(event: USBConnectEvents, device: USBDevice): CustomEvent {
		switch (event) {
			case "microbitUSBDeviceFound":
				return MicrobitUSBEvent.microbitUSBDeviceFound(device);
		}
		throw Error("Could not find constructor for the given event");
	}

	public static listenForUSBConnectEvent(event: USBConnectEvents, callback: (event: USBConnectEventData) => void) {
		document.addEventListener(event, callback);
	}

	public static listenForMicrobitUSBEvent(event: MicrobitUSBEvents, callback: (event: MicrobitUSBEventData) => void) {
		document.addEventListener(event, callback);
	}

	private static readonly microbitUSBDeviceFound = (
		usbDevice: USBDevice
	): CustomEvent => {
		return new CustomEvent("microbitUSBDeviceFound", {
			detail: { usbDevice: usbDevice }
		});
	};

	private static readonly microbitUSBConnected = (
		microbitUSB: EventEmittingMicrobitUSB
	): CustomEvent => {
		return new CustomEvent("microbitUSBConnected", {
			detail: { microbitUSB: microbitUSB }
		});
	};

	private static readonly microbitUSBFlashBegin = (
		microbitUSB: EventEmittingMicrobitUSB
	): CustomEvent => {
		return new CustomEvent("microbitUSBFlashBegin", {
			detail: { microbitUSB: microbitUSB }
		});
	};

	private static readonly microbitUSBFlashEnd = (
		microbitUSB: EventEmittingMicrobitUSB
	): CustomEvent => {
		return new CustomEvent("microbitUSBFlashEnd", {
			detail: { microbitUSB: microbitUSB }
		});
	};
}

/**
 * A USB connection to a micro:bit.
 */
class EventEmittingMicrobitUSB extends MicrobitUSB {
	protected constructor(usbDevice: USBDevice) {
		super(usbDevice);
		document.dispatchEvent(MicrobitUSBEvent.createMicrobitEvent("microbitUSBConnected", this));
	}

	/**
	 * Open prompt for USB connection.
	 * @returns {Promise<MicrobitUSB>} A promise that resolves to a new MicrobitUSB object.
	 */
	public static async eventEmittingRequestConnection():
	| Promise<EventEmittingMicrobitUSB> {
		const requestOptions: USBDeviceRequestOptions = {
			filters: [
				{
					vendorId: MBSpecs.USBSpecs.VENDOR_ID,
					productId: MBSpecs.USBSpecs.PRODUCT_ID
				}
			]
		};

		try {
			const device: USBDevice = await navigator.usb.requestDevice(
				requestOptions
			);
			if (!device) {
				return Promise.reject("Could not find device!");
			}
			document.dispatchEvent(MicrobitUSBEvent.createUSBConnectEvent("microbitUSBDeviceFound", device));
			return new EventEmittingMicrobitUSB(device);
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}

	/**
	 * Flashes a .hex file to the micro:bit.
	 * @param {string} hex The hex file to flash. (As a link)
	 * @param {(progress: number) => void} progressCallback A callback for progress.
	 */
	public async flashHex(
		hex: string,
		progressCallback: (progress: number) => void
	): Promise<void> {
		document.dispatchEvent(MicrobitUSBEvent.createMicrobitEvent("microbitUSBFlashBegin", this));
		const result = await super.flashHex(hex, progressCallback);
		document.dispatchEvent(MicrobitUSBEvent.createMicrobitEvent("microbitUSBFlashEnd", this));
		return result;
	}
}

export default EventEmittingMicrobitUSB;

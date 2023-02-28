import MicrobitBluetooth from "./MicrobitBluetooth";
import MBSpecs from "./MBSpecs";

type MicrobitBluetoothEvents =
	"microbitBluetoothConnected" |
	"microbitBluetoothDisconnected"

type BluetoothDeviceEvents = "microbitBluetoothDeviceFound"

type MicrobitBluetoothEventData = Event |
	{ detail: { usbDevice: EventEmittingMicrobitBluetooth } }

type BluetoothDeviceEventData = Event |
	{ detail: { usbDevice: BluetoothDevice } }

export class MicrobitBluetoothEvent {
	public static createMicrobitEvent(event: MicrobitBluetoothEvents, device: EventEmittingMicrobitBluetooth): CustomEvent {
		switch (event) {
			case "microbitBluetoothConnected":
				return this.microbitBluetoothConnected(device);
			case "microbitBluetoothDisconnected":
				return this.microbitBluetoothDisconnected(device);
		}
		throw Error("Could not find constructor for the given event");
	}

	public static createBluetoothConnectEvent(event: BluetoothDeviceEvents, device: BluetoothDevice): CustomEvent {
		switch (event) {
			case "microbitBluetoothDeviceFound":
				return this.microbitBluetoothDeviceFound(device);
		}
		throw Error("Could not find constructor for the given event");
	}

	public static listenForBluetoothConnectEvent(event: BluetoothDeviceEvents, callback: (event: BluetoothDeviceEventData) => void) {
		document.addEventListener(event, callback);
	}

	public static listenForBluetoothMicrobitEvent(event: BluetoothDeviceEvents, callback: (event: MicrobitBluetoothEventData) => void) {
		document.addEventListener(event, callback);
	}

	private static readonly microbitBluetoothDeviceFound = (
		bluetoothDevice: BluetoothDevice
	): CustomEvent => {
		return new CustomEvent("microbitBluetoothDeviceFound", {
			detail: { bluetoothDevice: bluetoothDevice }
		});
	};

	private static readonly microbitBluetoothConnected = (
		microbitBluetooth: MicrobitBluetooth
	): CustomEvent => {
		return new CustomEvent("microbitBluetoothConnected", {
			detail: { microbitBluetooth: microbitBluetooth }
		});
	};

	private static readonly microbitBluetoothDisconnected = (
		microbitBluetooth: MicrobitBluetooth
	): CustomEvent => {
		return new CustomEvent("microbitBluetoothDisconnected", {
			detail: { microbitBluetooth: microbitBluetooth }
		});
	};
}

class EventEmittingMicrobitBluetooth extends MicrobitBluetooth {
	private constructor(
		gattServer: BluetoothRemoteGATTServer,
		microbitVersion: 1 | 2,
		onDisconnect: (manual?: boolean) => void = () => {
			return;
		}
	) {
		const onDC = (manual?: boolean) => {
			document.dispatchEvent(
				MicrobitBluetoothEvent.createMicrobitEvent("microbitBluetoothDisconnected", this));
			if (onDisconnect) {
				onDisconnect(manual);
			}
		};
		super(gattServer, microbitVersion, onDC);
		document.dispatchEvent(
			MicrobitBluetoothEvent.createMicrobitEvent("microbitBluetoothConnected", this));
	}

	/**
	 * Opens a requestDevice prompt on the browser, searching for a micro:bit with the given name.
	 * @param {string} name
	 *      The name of the micro:bit.
	 * @param {Error => void} onRequestFailed
	 *      Fired if the request failed.
	 */
	public static async eventEmittingRequestDevice(
		name: string,
		onRequestFailed?: (e: Error) => void
	): Promise<BluetoothDevice> {
		return new Promise<BluetoothDevice>((resolve, reject) => {
			try {
				navigator.bluetooth
					.requestDevice({
						filters: [{ namePrefix: `BBC micro:bit [${name}]` }],
						optionalServices: [
							MBSpecs.Services.UART_SERVICE,
							MBSpecs.Services.ACCEL_SERVICE,
							MBSpecs.Services.DEVICE_INFO_SERVICE,
							MBSpecs.Services.LED_SERVICE,
							MBSpecs.Services.IO_SERVICE,
							MBSpecs.Services.BUTTON_SERVICE
						]
					})
					.then((btDevice) => {
						document.dispatchEvent(
							MicrobitBluetoothEvent.createBluetoothConnectEvent("microbitBluetoothDeviceFound", btDevice));
						resolve(btDevice);
					}).catch(e => reject(e));
			} catch (e: unknown) {
				if (onRequestFailed) {
					onRequestFailed(e as Error);
				}
				reject(e);
			}
		});
	}

	/**
	 * Attempts to connect to the micro:bit device.
	 *
	 * @param {BluetoothDevice} microbitDevice
	 *      The microbit device to connect to.
	 * @param {BluetoothRemoteGATTServer => void} onConnect
	 *      Fired when a successful connection is made.
	 * @param {(boolean) => void} onDisconnect
	 *      Fired when the device disconnects.
	 * @param {Error => void} onConnectFailed
	 *      Called when the connection failed.
	 */
	public static async createEventEmittingConnection(
		microbitDevice: BluetoothDevice,
		onConnect?: (gattServer?: BluetoothRemoteGATTServer) => void,
		onDisconnect?: (manual?: boolean) => void,
		onConnectFailed?: (err: Error) => void
	): Promise<MicrobitBluetooth> {
		try {
			if(microbitDevice.gatt === undefined){
				console.warn('Missing gatt server on microbit device:', microbitDevice)
				throw new Error("BluetoothRemoteGATTServer for microbit device is undefined");
			}
			const gattServer: BluetoothRemoteGATTServer =
				await microbitDevice.gatt.connect();

			const microbitVersion: 1 | 2 = await MBSpecs.Utility.getModelNumber(
				gattServer
			);

			// Create the connection object.
			const connection = new EventEmittingMicrobitBluetooth(
				gattServer,
				microbitVersion,
				onDisconnect
			);

			// fire the connect event and return the connection object
			if (onConnect) {
				if (gattServer.connected) {
					onConnect(gattServer);
				}
			}

			return connection;
		} catch (e: unknown) {
			if (onConnectFailed) {
				onConnectFailed(e as Error);
				if (microbitDevice.gatt !== undefined){
					microbitDevice.gatt.disconnect() // In cause bluetooth was connected but some other error occurs, disconnect bluetooth to keep consistent state
				}
			}
			return Promise.reject("Failed to establish a connection!");
		}
	}
}

export default EventEmittingMicrobitBluetooth;

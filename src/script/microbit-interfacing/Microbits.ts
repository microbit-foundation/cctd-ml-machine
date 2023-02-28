/**
 * Entrypoint for the Microbit facade pattern
 */
import EventEmittingMicrobitBluetooth from "./EventEmittingMicrobitBluetooth";
import ConnectionBehaviours from "../connection-behaviours/ConnectionBehaviours";
import connectionBehaviours from "../connection-behaviours/ConnectionBehaviours";
import EventEmittingMicrobitUSB from "./EventEmittingMicrobitUSB";
import { get, writable } from "svelte/store";
import MBSpecs from "./MBSpecs";
import MicrobitBluetooth from "./MicrobitBluetooth";
import { outputting } from "../stores/uiStore";

type QueueElement = {
	service: BluetoothRemoteGATTCharacteristic,
	view: DataView
}

/**
 * Entry point for microbit interfaces / Facade pattern
 */
class Microbits {
	public static hexFiles: { 1: string, 2: string, universal: string } = {
		1: "firmware/ml-microbit-cpp-version-combined.hex",
		2: "firmware/MICROBIT.hex",
		universal: "firmware/universal-hex.hex"
	};
	private static inputMicrobitBluetooth: EventEmittingMicrobitBluetooth | undefined = undefined;
	private static outputMicrobitBluetooth: EventEmittingMicrobitBluetooth | undefined = undefined;
	private static inputName: string | undefined = undefined;
	private static outputName: string | undefined = undefined;
	private static inputVersion: 1 | 2 | undefined;
	private static outputVersion: 1 | 2 | undefined;
	private static microbitUsb: EventEmittingMicrobitUSB | undefined = undefined;
	// Writable for the queue
	private static serviceQueue = writable<{ busy: boolean, queue: QueueElement[] }>({
		busy: false,
		queue: []
	});

	public static isBluetoothInputConnected(): boolean {
		if (this.inputMicrobitBluetooth === undefined) {
			return false;
		}
		return this.inputMicrobitBluetooth.isConnected();
	}

	public static isBluetoothOutputConnected(): boolean {
		if (this.outputMicrobitBluetooth === undefined) {
			return false;
		}
		return this.outputMicrobitBluetooth.isConnected();
	}

	public static isUSBConnected(): boolean {
		return this.microbitUsb !== undefined;
	}

	/**
	 * Attempts to connect via bluetooth.
	 * @param name The expected name of the microbit.
	 * @return Returns true if the connection was successful, else false.
	 */
	public static async connectBluetoothInput(name: string): Promise<boolean> {
		if (name.length !== 5) {
			throw new Error("Could not connect, the name specified must be of length 5!");
		}

		const connectionBehaviour = ConnectionBehaviours.getInputBehaviour();
		const onFailedConnection = (err: Error) => {
			connectionBehaviour.bluetoothConnectionError(err);
		};

		try {
			const request = await EventEmittingMicrobitBluetooth
				.eventEmittingRequestDevice(name, onFailedConnection);
			this.inputMicrobitBluetooth = await EventEmittingMicrobitBluetooth
				.createEventEmittingConnection(
					request,
					undefined,
					(manual) => {
						this.clearInputMicrobitReference();
						if (this.isBluetoothOutputConnected()) {
							this.disconnectBluetoothOutput();
						}
						this.clearOutputMicrobitReference();
						connectionBehaviours.getInputBehaviour().bluetoothDisconnect(manual, true);
						connectionBehaviours.getOutputBehaviour().bluetoothDisconnect(manual, true);
					},
					onFailedConnection
				);

			connectionBehaviour.bluetoothConnect(this.inputMicrobitBluetooth, name);
			this.inputName = name;
			this.inputVersion = this.inputMicrobitBluetooth.getVersion();
			await this.inputMicrobitBluetooth.listenToAccelerometer(connectionBehaviour.accelerometerChange.bind(connectionBehaviour));
			await this.inputMicrobitBluetooth.listenToButton("A", connectionBehaviour.buttonChange.bind(connectionBehaviour));
			await this.inputMicrobitBluetooth.listenToButton("B", connectionBehaviour.buttonChange.bind(connectionBehaviour));
			return true;
		} catch (e) {
			onFailedConnection(e as Error);
		}
		return false;
	}

	/**
	 * Attempts to connect via bluetooth.
	 * @param name The expected name of the microbit.
	 * @return Returns true if the connection was successful, else false.
	 */
	public static async connectBluetoothOutput(name: string): Promise<boolean> {
		console.assert(name.length == 5);

		const connectionBehaviour = ConnectionBehaviours.getOutputBehaviour();
		const onFailedConnection = (err: Error) => {
			connectionBehaviour.bluetoothConnectionError(err);
		};

		try {
			const request = await EventEmittingMicrobitBluetooth
				.eventEmittingRequestDevice(name, onFailedConnection);

			this.outputMicrobitBluetooth = await EventEmittingMicrobitBluetooth
				.createEventEmittingConnection(
					request,
					undefined,
					(manual) => {
						this.clearOutputMicrobitReference();
						connectionBehaviours.getOutputBehaviour().bluetoothDisconnect(manual);
					},
					onFailedConnection
				);
			connectionBehaviour.bluetoothConnect(this.outputMicrobitBluetooth, name);
			this.outputName = name;
			this.outputVersion = this.outputMicrobitBluetooth.getVersion();
			return true;
		} catch (e) {
			onFailedConnection(e as Error);
		}
		return false;
	}

	/**
	 * Returns the reference to the connected output microbit. Throws error if none are connected.
	 */
	public static getBluetoothOutput(): EventEmittingMicrobitBluetooth {
		if (!this.outputMicrobitBluetooth) {
			throw new Error("No output microbit has been assigned!");
		}
		return this.outputMicrobitBluetooth;
	}

	/**
	 * Returns the reference to the connected input microbit. Throws error if none are connected.
	 */
	public static getBluetoothInput(): EventEmittingMicrobitBluetooth {
		if (!this.inputMicrobitBluetooth) {
			throw new Error("No input microbit has been assigned!");
		}
		return this.inputMicrobitBluetooth;
	}

	public static isInputOutputTheSame() {
		return this.outputName == this.inputName; // todo: replace with bluetooth ID or something more unique than name
	}

	public static disconnectBluetoothInputAndOutput() {
		if (!this.isBluetoothInputConnected() && !this.isBluetoothOutputConnected()) {
			throw new Error("Could not disconnect microbits, none have been connected yet!");
		}

		if (this.isInputOutputTheSame()) {
			// If they are the same, it suffices to disconnect one of them, doesn't matter which(in or output).
			this.disconnectInputGATT();
		} else {
			if (this.isBluetoothOutputConnected()) {
				this.disconnectOutputGATT();
			}
			if (this.isBluetoothInputConnected()) {
				this.disconnectInputGATT();
			}
		}
		this.clearInputMicrobitReference();
		this.clearOutputMicrobitReference();
	}

	public static disconnectBluetoothOutput() {
		if (!this.isBluetoothOutputConnected()) {
			throw new Error("Cannot disconnect, no output micro:bit is connected");
		}
		ConnectionBehaviours.getOutputBehaviour().bluetoothDisconnect(true);
		if (this.isInputOutputTheSame()) {
			this.clearOutputMicrobitReference();
			void this.setGladSmiley(this.inputMicrobitBluetooth!);
		} else {
			this.disconnectOutputGATT();
			this.clearOutputMicrobitReference();
		}
	}

	public static disconnectBluetoothInput() {
		if (!this.isBluetoothInputConnected()) {
			throw new Error("Cannot disconnect, no input micro:bit is connected");
		}
		ConnectionBehaviours.getInputBehaviour().bluetoothDisconnect(true);
		if (this.isInputOutputTheSame()) {
			this.disconnectBluetoothInputAndOutput();
		} else {
			this.disconnectInputGATT();
			this.clearInputMicrobitReference();
		}
	}

	public static async sendToOutputPin(data: any[]) { // todo: isn't part of the feature set for DR, not tested
		if (!this.isBluetoothOutputConnected()) {
			throw new Error("No output microbit is connected, cannot send to pin.");
		}

		const IO = await this.getIOOf(this.outputMicrobitBluetooth!);
		const dataView = new DataView(new ArrayBuffer(data.length * 2));
		data.forEach((point, index) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			dataView.setInt8(index * 2 + 0, point.pin);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			dataView.setInt8(index * 2 + 1, point.on ? 1 : 0);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
			outputting.set({ text: `Turn pin ${point.pin} ${point.on ? "on" : "off"}` });
		});
		this.addToServiceQueue(IO, dataView);
	}

	public static async setOutputMatrix(matrix: boolean[]) {
		if (!this.isBluetoothOutputConnected()) {
			throw new Error("No output microbit is connected, cannot set matrix.");
		}
		const service = await this.getMatrixOf(this.outputMicrobitBluetooth!);
		const dataView = new DataView(new ArrayBuffer(5));
		for (let i = 0; i < 5; i++) {
			dataView.setUint8(i, this.subarray(matrix, (0 + i * 5), (5 + i * 5))
				.reduce((byte, bool) => byte << 1 | (bool ? 1 : 0), 0));
		}
		this.addToServiceQueue(service, dataView);
	}

	public static useInputAsOutput() {
		if (!this.inputMicrobitBluetooth) {
			throw new Error("No input microbit has be defined! Please check that it is connected before using it");
		}
		if (!this.inputName) {
			throw new Error("Something went wrong. Input microbit was specified, but without name!");
		}
		this.outputMicrobitBluetooth = this.inputMicrobitBluetooth;
		this.outputName = this.inputName;
		this.outputVersion = this.inputVersion;
		ConnectionBehaviours.getOutputBehaviour().bluetoothConnect(this.outputMicrobitBluetooth, this.outputName);
	}

	public static getInputVersion(): 1 | 2 {
		if (!this.inputVersion) {
			throw new Error("No version has been set, has the micro:bit been connected?");
		}

		return this.inputVersion;
	}

	public static getOutputVersion(): 1 | 2 {
		if (!this.outputVersion) {
			throw new Error("No version has been set, has the micro:bit been connected?");
		}

		return this.outputVersion;
	}

	public static getOutputName(): string {
		if (!this.outputName) {
			throw new Error("No name has been set, has the micro:bit connected?");
		}
		return this.outputName;
	}

	public static getInputName(): string {
		if (!this.inputName) {
			throw new Error("No name has been set, has the micro:bit connected?");
		}
		return this.inputName;
	}

	public static async sendToOutputUart(type: string, value: string) {
		if (!this.outputMicrobitBluetooth) {
			throw new Error("No output microbit has been set");
		}
		const uartService = await this.outputMicrobitBluetooth.getUARTService();
		const uartCharacteristic = await uartService.getCharacteristic(MBSpecs.Characteristics.UART_DATA_RX);

		const view = new DataView(new ArrayBuffer(2 + value.length));

		view.setUint8(0, type.charCodeAt(0));
		for (let i = 0; i < value.length; i++) {
			view.setUint8(i + 1, value.charCodeAt(i));
		}
		view.setUint8(1 + value.length, "#".charCodeAt(0));

		this.addToServiceQueue(uartCharacteristic, view);
	}

	public static async connectUSB() {
		try {
			this.microbitUsb = await EventEmittingMicrobitUSB.eventEmittingRequestConnection();
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}

	public static async disconnectUSB() {
		if (!this.isUSBConnected()) {
			throw new Error("Cannot disconnect USB. No USB microbit could be found");
		}
		await this.microbitUsb!.disconnect();
	}

	/**
	 * Flashes the appropriate hex file to the micro:bit which is connected via USB
	 * @param progressCallback The callback that is fired each time the progress status is updated
	 */
	public static flashHexToUSB(progressCallback: (progress: number) => void) {
		if (!this.isUSBConnected()) {
			throw new Error("Cannot flash to USB, none are connected!");
		}
		const version = this.microbitUsb!.getModelNumber();
		const hex = this.hexFiles[version]; // Note: For this we CANNOT use the universal hex file (don't know why)
		return this.microbitUsb!.flashHex(hex, progressCallback);
	}

	public static async getUSBFriendlyName() {
		if (!this.isUSBConnected()) {
			throw new Error("Cannot get friendly name from USB, none are connected!");
		}
		return await this.microbitUsb!.getFriendlyName();
	}

	private static disconnectInputGATT() {
		if (!this.inputMicrobitBluetooth) {
			throw new Error("No input micro:bit could be found while disconnecting from GATT");
		}
		this.inputMicrobitBluetooth.disconnect();
	}

	private static disconnectOutputGATT() {
		if (!this.outputMicrobitBluetooth) {
			throw new Error("No output micro:bit could be found while disconnecting from GATT");
		}
		this.outputMicrobitBluetooth.disconnect();
	}

	private static clearOutputMicrobitReference() {
		this.outputMicrobitBluetooth = undefined;
		this.outputName = undefined;
		this.outputVersion = undefined;
	}

	private static clearInputMicrobitReference() {
		this.inputMicrobitBluetooth = undefined;
		this.inputName = undefined;
		this.inputVersion = undefined;
	}

	private static addToServiceQueue(service: BluetoothRemoteGATTCharacteristic, view: DataView) {
		this.serviceQueue.update(update => {
			update.queue.push({ service, view });
			return update;
		});
		this.processServiceQueue();
	}

	private static processServiceQueue() {
		if (get(this.serviceQueue).busy || get(this.serviceQueue).queue.length == 0) return;
		get(this.serviceQueue).busy = true;
		const { service, view } = get(this.serviceQueue).queue.shift() ?? { service: undefined, view: undefined };
		if (service === undefined) {
			throw new Error("Could not process the service queue, an element in the queue was not provided with a service to execute on.");
		}
		service.writeValue(view).then(() => {
			get(this.serviceQueue).busy = false;
			this.processServiceQueue();
		}).catch(err => {
			// Catches a characteristic not found error, preventing further output.
			// Why does this happens is not clear.
			console.log(err);
			get(this.serviceQueue).busy = false;
			this.processServiceQueue();
		});
	}

	private static async getMatrixOf(mb: MicrobitBluetooth): Promise<BluetoothRemoteGATTCharacteristic> {
		if (!mb) {
			throw new Error("Cannot get matrix of undefined microbit");
		}
		const LEDService = await mb.getLEDService();
		return await LEDService.getCharacteristic(MBSpecs.Characteristics.LED_MATRIX_STATE);
	}

	private static async getIOOf(mb: MicrobitBluetooth): Promise<BluetoothRemoteGATTCharacteristic> {
		if (!mb) {
			throw new Error("Cannot get IO of undefined microbit.");
		}
		const IOService = await mb.getIOService();
		return await IOService.getCharacteristic(MBSpecs.Characteristics.IO_DATA);
	}

	private static subarray<T>(arr: T[], start: number, end: number): T[] {
		const newArr: T[] = [];
		for (let i = start; i < end; i++) {
			newArr.push(arr[i]);
		}
		return newArr;
	}

	private static async setGladSmiley(mb: MicrobitBluetooth) {
		try {
			await mb.setLEDMatrix([
				[0, 0, 0, 0, 0],
				[0, 1, 0, 1, 0],
				[0, 0, 0, 0, 0],
				[1, 0, 0, 0, 1],
				[0, 1, 1, 1, 0]
			]);
		} catch (e) {
			console.log(e);
		}
	}
}

export default Microbits;
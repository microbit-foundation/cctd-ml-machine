/**
 * Entrypoint for the Microbit facade pattern
 */
import ConnectionBehaviours from "../connection-behaviours/ConnectionBehaviours";
import { get, writable } from "svelte/store";
import MBSpecs from "./MBSpecs";
import MicrobitBluetooth from "./MicrobitBluetooth";
import {outputting} from "../stores/uiStore";
import MicrobitUSB from "./MicrobitUSB";
import type ConnectionBehaviour from "../connection-behaviours/ConnectionBehaviour";

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
	private static assignedInputMicrobit: MicrobitBluetooth | undefined = undefined;
	private static assignedOutputMicrobit: MicrobitBluetooth | undefined = undefined;
	private static inputName: string | undefined = undefined;
	private static outputName: string | undefined = undefined;
	private static inputVersion: MBSpecs.MBVersion | undefined;
	private static outputVersion: MBSpecs.MBVersion | undefined;
	private static linkedMicrobit: MicrobitUSB | undefined = undefined;

	private static bluetoothServiceActionQueue = writable<{ busy: boolean, queue: QueueElement[] }>({
		busy: false,
		queue: []
	});

	/**
	 * Whether an input micro:bit is assigned
	 */
	public static isInputAssigned(): boolean {
		return this.assignedInputMicrobit !== undefined;
	}

	/**
	 * Whether the micro:bit assigned as input is currently connected
	 */
	public static isInputConnected(): boolean {
		if (!this.isInputAssigned()) {
			return false;
		}
		return this.assignedInputMicrobit!.isConnected();
	}

	/**
	 * Whether an output micro:bit is assigned
	 */
	public static isOutputAssigned(): boolean {
		if (this.assignedOutputMicrobit === undefined) {
			return false;
		}
		return this.assignedOutputMicrobit.isConnected();
	}

	/**
	 * Whether the micro:bit assigned as output is currently connected
	 */
	public static isOutputConnected(): boolean {
		if (!this.isOutputAssigned()) {
			return false;
		}
		return this.assignedOutputMicrobit!.isConnected();
	}

	/**
	 * Whether a micro:bit is linked (via USB)
	 */
	public static isMicrobitLinked(): boolean {
		return this.linkedMicrobit !== undefined;
	}

	/**
	 * Attempts to assign and connect via bluetooth.
	 * @param name The expected name of the microbit.
	 * @return Returns true if the connection was successful, else false.
	 */
	public static async assignInput(name: string): Promise<boolean> {
		if (name.length !== 5) {
			throw new Error("Could not connect, the name specified must be of length 5!");
		}

		const connectionBehaviour = ConnectionBehaviours.getInputBehaviour();
		const onFailedConnection = (err: Error) => {
			if (err) {
				if (err.message && err.message.includes("User cancelled the requestDevice() chooser")) {
					// User just cancelled
					connectionBehaviour.onCancelledBluetoothRequest();
				} else {
					throw err; // Todo: handle other cases and add events to connection behaviour interface
				}
			} else {
				throw new Error("An unknown error occured while attempting to connect via Bluetooth")
			}
		};

		try {
			const request = await MicrobitBluetooth
				.requestDevice(name, onFailedConnection);
			await MicrobitBluetooth
				.createMicrobitBluetooth(
					request,
					(microbit) => {
						this.assignedInputMicrobit = microbit;
						connectionBehaviour.onConnected(name)
						Microbits.listenToInputServices().then(() => {
							connectionBehaviour.onReady();
						}).catch((e) => {
							console.log("Failed to listen")
							console.log(e)
						})
					},
					(manual) => {
						if (manual) {
							ConnectionBehaviours.getInputBehaviour().onExpelled(manual, true);
							ConnectionBehaviours.getOutputBehaviour().onExpelled(manual, true);
							this.clearAssignedOutputReference();
						} else {
							connectionBehaviour.onDisconnected();
						}
					},
					onFailedConnection,
					(microbit) => {
						connectionBehaviour.onConnected(name)
						this.assignedInputMicrobit = microbit;
						Microbits.listenToInputServices().then(() => {
							connectionBehaviour.onReady()
						}).catch((e) => {
							this.assignedInputMicrobit?.disconnect()
							console.log(e)
						})
					},
					() => {
						ConnectionBehaviours.getInputBehaviour().onExpelled(false, true);
						ConnectionBehaviours.getOutputBehaviour().onExpelled(false, true);
					}
				);

			connectionBehaviour.onAssigned(this.assignedInputMicrobit!, name);
			this.inputName = name;
			this.inputVersion = this.assignedInputMicrobit!.getVersion();
			return true;
		} catch (e) {
			console.log(e);
			onFailedConnection(e as Error);
		}
		return false;
	}

	private static async listenToInputServices(): Promise<void> {
		const connectionBehaviour = ConnectionBehaviours.getInputBehaviour();
		if (!this.isInputConnected()) {
			throw new Error("Could not listen to services, no microbit connected!")
		}
		await this.assignedInputMicrobit!.listenToAccelerometer(connectionBehaviour.accelerometerChange.bind(connectionBehaviour));
		await this.assignedInputMicrobit!.listenToButton("A", connectionBehaviour.buttonChange.bind(connectionBehaviour));
		await this.assignedInputMicrobit!.listenToButton("B", connectionBehaviour.buttonChange.bind(connectionBehaviour));
	}

	/**
	 * Attempts to assign and connect via bluetooth.
	 * @param name The expected name of the microbit.
	 * @return Returns true if the connection was successful, else false.
	 */
	public static async assignOutput(name: string): Promise<boolean> {
		console.assert(name.length == 5);

		const connectionBehaviour: ConnectionBehaviour = ConnectionBehaviours.getOutputBehaviour();
		const onFailedConnection = (err: Error) => {
			console.log(err)
			connectionBehaviour.onCancelledBluetoothRequest();
		};

		try {
			const request = await MicrobitBluetooth
				.requestDevice(name, onFailedConnection);

			this.assignedOutputMicrobit = await MicrobitBluetooth
				.createMicrobitBluetooth(
					request,
					() => connectionBehaviour.onConnected(name),
					(manual) => {
						this.clearAssignedOutputReference();
						if (manual) {
							ConnectionBehaviours.getOutputBehaviour().onExpelled(manual);
						} else {
							ConnectionBehaviours.getOutputBehaviour().onDisconnected();
						}
					},
					onFailedConnection
				);
			connectionBehaviour.onAssigned(this.assignedOutputMicrobit, name);
			this.outputName = name;
			this.outputVersion = this.assignedOutputMicrobit.getVersion();
			return true;
		} catch (e) {
			onFailedConnection(e as Error);
		}
		return false;
	}

	/**
	 * Returns the reference to the connected output microbit. Throws error if none are connected.
	 */
	public static getAssignedOutput(): MicrobitBluetooth {
		if (!this.assignedOutputMicrobit) {
			throw new Error("No output microbit has been assigned!");
		}
		return this.assignedOutputMicrobit;
	}

	/**
	 * Returns the reference to the connected input microbit. Throws error if none are connected.
	 */
	public static getAssignedInput(): MicrobitBluetooth {
		if (!this.assignedInputMicrobit) {
			throw new Error("No input microbit has been assigned!");
		}
		return this.assignedInputMicrobit;
	}

	public static isInputOutputTheSame() {
		return this.outputName == this.inputName; // todo: replace with bluetooth ID or something more unique than name
	}

	public static expelInputAndOutput() {
		if (!this.isInputAssigned() && !this.isOutputAssigned()) {
			throw new Error("Could not disconnect microbits, none have been connected yet!");
		}

		if (this.isInputOutputTheSame()) {
			// If they are the same, it suffices to disconnect one of them, doesn't matter which(in or output).
			this.disconnectInputGATT();
		} else {
			if (this.isOutputAssigned()) {
				this.disconnectOutputGATT();
			}
			if (this.isInputAssigned()) {
				this.disconnectInputGATT();
			}
		}
		this.clearAssignedInputReference();
		this.clearAssignedOutputReference();
	}

	public static expelOutput() {
		if (!this.isOutputAssigned()) {
			throw new Error("Cannot disconnect, no output micro:bit is connected");
		}
		ConnectionBehaviours.getOutputBehaviour().onExpelled(true);
		if (this.isInputOutputTheSame()) {
			this.clearAssignedOutputReference();
			void this.setGladSmiley(this.assignedInputMicrobit!);
		} else {
			this.disconnectOutputGATT();
			this.clearAssignedOutputReference();
		}
	}

	public static expelInput() {
		if (!this.isInputAssigned()) {
			throw new Error("Cannot disconnect, no input micro:bit is connected");
		}
		ConnectionBehaviours.getInputBehaviour().onExpelled(true);
		if (this.isInputOutputTheSame()) {
			this.expelInputAndOutput();
		} else {
			this.disconnectInputGATT();
			this.clearAssignedInputReference();
		}
	}

	public static async sendToOutputPin(data: any[]) { // todo: isn't part of the feature set for DR, not tested
		if (!this.isOutputAssigned()) {
			throw new Error("No output microbit is connected, cannot send to pin.");
		}

		const IO = await this.getIOOf(this.assignedOutputMicrobit!);
		const dataView = new DataView(new ArrayBuffer(data.length * 2));
		data.forEach((point, index) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			dataView.setInt8(index * 2 + 0, point.pin);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			dataView.setInt8(index * 2 + 1, point.on ? 1 : 0);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
			outputting.set({ text: `Turn pin ${point.pin} ${point.on ? "on" : "off"}` });
		});
		this.addToServiceActionQueue(IO, dataView);
	}

	public static async setOutputMatrix(matrix: boolean[]) {
		if (!this.isOutputAssigned()) {
			throw new Error("No output microbit is connected, cannot set matrix.");
		}
		const service = await this.getMatrixOf(this.assignedOutputMicrobit!);
		const dataView = new DataView(new ArrayBuffer(5));
		for (let i = 0; i < 5; i++) {
			dataView.setUint8(i, this.subarray(matrix, (0 + i * 5), (5 + i * 5))
				.reduce((byte, bool) => byte << 1 | (bool ? 1 : 0), 0));
		}
		this.addToServiceActionQueue(service, dataView);
	}

	public static useInputAsOutput() {
		if (!this.assignedInputMicrobit) {
			throw new Error("No input microbit has be defined! Please check that it is connected before using it");
		}
		if (!this.inputName) {
			throw new Error("Something went wrong. Input microbit was specified, but without name!");
		}
		this.assignedOutputMicrobit = this.assignedInputMicrobit;
		this.outputName = this.inputName;
		this.outputVersion = this.inputVersion;
		ConnectionBehaviours.getOutputBehaviour().onAssigned(this.assignedOutputMicrobit, this.outputName);
	}

	public static getInputVersion(): MBSpecs.MBVersion {
		if (!this.inputVersion) {
			throw new Error("No version has been set, has the micro:bit been connected?");
		}

		return this.inputVersion;
	}

	public static getOutputVersion(): MBSpecs.MBVersion {
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
		if (!this.assignedOutputMicrobit) {
			throw new Error("No output microbit has been set");
		}
		const uartService = await this.assignedOutputMicrobit.getUARTService();
		const uartCharacteristic = await uartService.getCharacteristic(MBSpecs.Characteristics.UART_DATA_RX);

		const view = new DataView(new ArrayBuffer(2 + value.length));

		view.setUint8(0, type.charCodeAt(0));
		for (let i = 0; i < value.length; i++) {
			view.setUint8(i + 1, value.charCodeAt(i));
		}
		view.setUint8(1 + value.length, "#".charCodeAt(0));

		this.addToServiceActionQueue(uartCharacteristic, view);
	}

	public static async linkMicrobit() {
		try {
			this.linkedMicrobit = await MicrobitUSB.requestConnection();
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}

	public static async unlinkMicrobit() {
		if (!this.isMicrobitLinked()) {
			throw new Error("Cannot disconnect USB. No USB microbit could be found");
		}
		await this.linkedMicrobit!.disconnect();
	}

	/**
	 * Flashes the appropriate hex file to the micro:bit which is connected via USB
	 * @param progressCallback The callback that is fired each time the progress status is updated
	 */
	public static flashHexToLinked(progressCallback: (progress: number) => void) {
		if (!this.isMicrobitLinked()) {
			throw new Error("Cannot flash to USB, none are connected!");
		}
		const version = this.linkedMicrobit!.getModelNumber();
		const hex = this.hexFiles[version]; // Note: For this we CANNOT use the universal hex file (don't know why)
		return this.linkedMicrobit!.flashHex(hex, progressCallback);
	}

	public static async getLinkedFriendlyName() {
		if (!this.isMicrobitLinked()) {
			throw new Error("Cannot get friendly name from USB, none are connected!");
		}
		return await this.linkedMicrobit!.getFriendlyName();
	}

	private static disconnectInputGATT() {
		if (!this.assignedInputMicrobit) {
			throw new Error("No input micro:bit could be found while disconnecting from GATT");
		}
		this.assignedInputMicrobit.disconnect();
	}

	private static disconnectOutputGATT() {
		if (!this.assignedOutputMicrobit) {
			throw new Error("No output micro:bit could be found while disconnecting from GATT");
		}
		this.assignedOutputMicrobit.disconnect();
	}

	private static clearAssignedOutputReference() {
		this.assignedOutputMicrobit = undefined;
		this.outputName = undefined;
		this.outputVersion = undefined;
	}

	private static clearAssignedInputReference() {
		this.assignedInputMicrobit = undefined;
		this.inputName = undefined;
		this.inputVersion = undefined;
	}

	private static addToServiceActionQueue(service: BluetoothRemoteGATTCharacteristic, view: DataView) {
		this.bluetoothServiceActionQueue.update(update => {
			update.queue.push({ service, view });
			return update;
		});
		this.processServiceActionQueue();
	}

	private static processServiceActionQueue() {
		if (get(this.bluetoothServiceActionQueue).busy || get(this.bluetoothServiceActionQueue).queue.length == 0) return;
		get(this.bluetoothServiceActionQueue).busy = true;
		const { service, view } = get(this.bluetoothServiceActionQueue).queue.shift() ?? { service: undefined, view: undefined };
		if (service === undefined) {
			throw new Error("Could not process the service queue, an element in the queue was not provided with a service to execute on.");
		}
		service.writeValue(view).then(() => {
			get(this.bluetoothServiceActionQueue).busy = false;
			this.processServiceActionQueue();
		}).catch(err => {
			// Catches a characteristic not found error, preventing further output.
			// Why does this happens is not clear.
			console.log(err);
			get(this.bluetoothServiceActionQueue).busy = false;
			this.processServiceActionQueue();
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
import MBSpecs from "./MBSpecs";

/**
 * UART data target. For fixing type compatibility issues.
 */
type CharacteristicDataTarget = EventTarget & {
	value: DataView;
};

/**
 * The connection to the micro:bit.
 */
export class MicrobitBluetooth {
	private readonly device: BluetoothDevice;

	private disconnectHasFired: boolean;
	private dcListener: OmitThisParameter<(event: Event) => void>;

	/**
	 * Constructs a bluetooth connection object. Should not be called directly.
	 * Use MicrobitBluetooth.createConnection instead.
	 *
	 *    The microbit device to connect to.
	 *    Callback to be called when the connection is established.
	 * @param {BluetoothRemoteGATTServer} gattServer
	 *      The gattServer, that has been attached to this micro:bit.
	 * @param {number} microbitVersion
	 *      The version of micro:bit.
	 * @param {boolean => void} onDisconnect
	 *      Fired when the micro:bit disconnects.
	 */
	protected constructor(
		private gattServer: BluetoothRemoteGATTServer,
		private microbitVersion: 1 | 2,
		private onDisconnect: (manual?: boolean) => void
	) {
		this.dcListener = this.disconnectListener.bind(this);
		this.disconnectHasFired = false;
		this.device = gattServer.device;
		this.device.addEventListener(
			"gattserverdisconnected",
			this.dcListener
		);
	}

	/**
	 * Adds a listener for the 'gattserverdisconnected' event.
	 * @param {Event => void} callback The function to execute.
	 */
	public listenForDisconnect(callback: (event: Event) => any): void {
		return this.device.addEventListener("gattserverdisconnected", callback);
	}

	/**
	 * Removes a listener for the 'gattserverdisconnected' event.
	 * @param callback
	 */
	public removeDisconnectListener(callback: (event: Event) => any): void {
		return this.device.removeEventListener("gattserverdisconnected", callback);
	}

	/**
	 * @returns {BluetoothDevice} The BluetoothDevice object of the micro:bit.
	 */
	public getDevice(): BluetoothDevice {
		return this.device;
	}

	/**
	 * @returns {Promise<BluetoothRemoteGATTService>} The UART service of the micro:bit.
	 */
	public async getUARTService(): Promise<BluetoothRemoteGATTService> {
		try {
			return await this.gattServer.getPrimaryService(
				MBSpecs.Services.UART_SERVICE
			);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	/**
	 * @returns {Promise<BluetoothRemoteGATTService>} The accelerometer service of the micro:bit.
	 */
	public async getAccelerometerService(): Promise<BluetoothRemoteGATTService> {
		try {
			return await this.gattServer.getPrimaryService(
				MBSpecs.Services.ACCEL_SERVICE
			);
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}

	/**
	 * @returns {Promise<BluetoothRemoteGATTService>} The button service of the micro:bit.
	 */
	public async getButtonService(): Promise<BluetoothRemoteGATTService> {
		try {
			return await this.gattServer.getPrimaryService(
				MBSpecs.Services.BUTTON_SERVICE
			);
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}

	/**
	 * @returns {Promise<BluetoothRemoteGATTService>} The device information service of the micro:bit.
	 */
	public async getDeviceInfoService(): Promise<BluetoothRemoteGATTService> {
		try {
			return await this.gattServer.getPrimaryService(
				MBSpecs.Services.DEVICE_INFO_SERVICE
			);
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}

	/**
	 * @returns {Promise<BluetoothRemoteGATTService>} The LED service of the micro:bit.
	 */
	public async getLEDService(): Promise<BluetoothRemoteGATTService> {
		try {
			return await this.gattServer.getPrimaryService(
				MBSpecs.Services.LED_SERVICE
			);
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}

	/**
	 * @returns {Promise<BluetoothRemoteGATTService>} The IO service of the micro:bit.
	 */
	public async getIOService(): Promise<BluetoothRemoteGATTService> {
		try {
			return await this.gattServer.getPrimaryService(MBSpecs.Services.IO_SERVICE);
		} catch (e) {
			console.log(e);
			return Promise.reject(e);
		}
	}

	/**
	 * Whether the connection is currently established.
	 * @return {boolean} True if the connection is established, false otherwise.
	 */
	public isConnected(): boolean {
		return this.gattServer.connected;
	}

	/**
	 * @return {BluetoothRemoteGATTServer} The GATT server of the micro:bit.
	 */
	public getGattServer(): BluetoothRemoteGATTServer {
		if (!this.isConnected()) {
			throw new Error(
				"MicrobitConnection: gatt server is not available until after connection is established"
			);
		}

		return this.gattServer;
	}

	/**
	 * @returns {number} The version of the micro:bit.
	 */
	public getVersion(): 1 | 2 {
		return this.microbitVersion;
	}

	/**
	 * Disconnects from the micro:bit.
	 */
	public disconnect(): void {
		if (this.isConnected()) {
			this.device.removeEventListener(
				"gattserverdisconnected",
				this.dcListener
			);
			this.gattServer.disconnect();
			this.disconnectEventHandler(true);
		}
	}

	/**
	 * Listen to the UART data transmission characteristic
	 * @param {(string) => void} onDataReceived Callback to be called when data is received.
	 */
	public async listenToUART(
		onDataReceived: (data: string) => void
	): Promise<void> {
		const uartService: BluetoothRemoteGATTService = await this.getUARTService();
		const uartTXCharacteristic: BluetoothRemoteGATTCharacteristic =
			await uartService.getCharacteristic(MBSpecs.Characteristics.UART_DATA_TX);

		await uartTXCharacteristic.startNotifications();

		uartTXCharacteristic.addEventListener(
			"characteristicvaluechanged",
			(event: Event) => {
				// Convert the data to a string.
				const receivedData: number[] = [];
				const target: CharacteristicDataTarget =
					event.target as CharacteristicDataTarget;
				for (let i = 0; i < target.value.byteLength; i += 1) {
					receivedData[i] = target.value.getUint8(i);
				}
				const receivedString = String.fromCharCode.apply(null, receivedData);

				onDataReceived(receivedString);
			}
		);
	}

	/**
	 * @param {MBSpecs.Button} buttonToListenFor
	 *      The button to listen to.
	 * @param {(MBSpecs.ButtonState, MBSpecs.Button) => void} onButtonChanged
	 *      Button change callback.
	 */
	public async listenToButton(
		buttonToListenFor: MBSpecs.Button,
		onButtonChanged: (
			state: MBSpecs.ButtonState,
			button: MBSpecs.Button
		) => void
	): Promise<void> {
		const buttonService: BluetoothRemoteGATTService =
			await this.getButtonService();

		// Select the correct characteristic to listen to.
		const UUID =
			buttonToListenFor === "A"
				? MBSpecs.Characteristics.BUTTON_A
				: MBSpecs.Characteristics.BUTTON_B;
		const buttonCharacteristic: BluetoothRemoteGATTCharacteristic =
			await buttonService.getCharacteristic(UUID);

		await buttonCharacteristic.startNotifications();

		buttonCharacteristic.addEventListener(
			"characteristicvaluechanged",
			(event: Event) => {
				const target: CharacteristicDataTarget =
					event.target as CharacteristicDataTarget;
				const stateId = target.value.getUint8(0);
				let state: MBSpecs.ButtonState = MBSpecs.ButtonStates.Released;
				if (stateId === 1) {
					state = MBSpecs.ButtonStates.Pressed;
				}
				if (stateId === 2) {
					state = MBSpecs.ButtonStates.LongPressed;
				}

				onButtonChanged(state, buttonToListenFor);
			}
		);
	}

	/**
	 * @param {(number, number, number) => void} onAccelerometerChanged Callback to be executed when the accelerometer changes.
	 */
	public async listenToAccelerometer(
		onAccelerometerChanged: (x: number, y: number, z: number) => void
	): Promise<void> {
		const accelerometerService: BluetoothRemoteGATTService =
			await this.getAccelerometerService();

		const accelerometerCharacteristic: BluetoothRemoteGATTCharacteristic =
			await accelerometerService.getCharacteristic(
				MBSpecs.Characteristics.ACCEL_DATA
			);

		await accelerometerCharacteristic.startNotifications();

		accelerometerCharacteristic.addEventListener(
			"characteristicvaluechanged",
			(event: Event) => {
				const target: CharacteristicDataTarget =
					event.target as CharacteristicDataTarget;
				const x = target.value.getInt16(0, true);
				const y = target.value.getInt16(2, true);
				const z = target.value.getInt16(4, true);

				onAccelerometerChanged(x, y, z);
			}
		);
	}

	/**
	 * Display the 5x5 matrix on the micro:bit.
	 *
	 * @param {number[][]} matrix The matrix to display.
	 */
	public async setLEDMatrix(matrix: number[][]): Promise<void>;

	/**
	 * Display the 5x5 matrix on the micro:bit.
	 *
	 * @param {boolean[][]} matrix The matrix to display.
	 */
	public async setLEDMatrix(matrix: boolean[][]): Promise<void>;

	/**
	 * Display the 5x5 matrix on the micro:bit.
	 *
	 * @param matrix The matrix to display.
	 */
	public async setLEDMatrix(matrix: unknown[][]): Promise<void> {
		if (matrix.length !== 5 || matrix[0].length !== 5)
			throw new Error("Matrix must be 5x5");

		// To match overloads we must cast the matrix to a number[][]
		let numMatrix = matrix as number[][];
		if (typeof matrix[0][0] === "boolean") {
			const boolMatrix = matrix as boolean[][];
			numMatrix = boolMatrix.map((row) =>
				row.map((value) => (value ? 1 : 0))
			);
		}
		const ledService: BluetoothRemoteGATTService = await this.getLEDService();
		const ledCharacteristic: BluetoothRemoteGATTCharacteristic =
			await ledService.getCharacteristic(
				MBSpecs.Characteristics.LED_MATRIX_STATE
			);

		// Create the dataview that will be sent through the bluetooth characteristic.
		const data = new Uint8Array(5);
		for (let i = 0; i < 5; i += 1)
			data[i] = MBSpecs.Utility.arrayToOctet(numMatrix[i]);

		const dataView = new DataView(data.buffer);

		await ledCharacteristic.writeValue(dataView);
	}

	/**
	 * Reference for the disconnect listener. Makes it easier to remove it again later.
	 * @param {Event} event The disconnect event
	 * @private
	 */
	private disconnectListener(event: Event): void {
		this.disconnectEventHandler(false);
	}

	/**
	 * Fires when the micro:bit disconnects.
	 */
	private disconnectEventHandler(manual?: boolean): void {
		if (this.disconnectHasFired) return;
		if (this.device === undefined) return;
		if (this.onDisconnect) {
			this.disconnectHasFired = true;
			this.onDisconnect(manual);
		}
	}
}

export default MicrobitBluetooth;

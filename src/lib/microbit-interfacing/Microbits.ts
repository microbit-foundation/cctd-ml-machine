/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Entrypoint for the Microbit facade pattern
 */
import StaticConfiguration from '../../StaticConfiguration';
import {
  MBSpecs,
  Microbit,
  MicrobitBluetoothDevice,
  MicrobitDeviceState,
} from 'microbyte';
import Logger from '../utils/Logger';
import OutputMicrobitHandler from './OutputMicrobitHandler';
import CombinedMicrobitHandler from './CombinedMicrobitHandler';
import { HexOrigin } from './HexOrigin';
import { stores } from '../stores/Stores';

type UARTMessageType = 'g' | 's'; // Gesture or sound

/**
 * Entry point for microbit interfaces
 */
class Microbits {
  private static microbits: Microbit[] = [
    new Microbit(), // Input
    new Microbit(), // Output (May not be used if input/output is the same, then defer to the above)
  ];

  private static inputIndexRef = 0;
  private static outputIndexRef = 1;

  public static hexFiles: { 1: string; 2: string; universal: string } = {
    1: 'firmware/ml-microbit-cpp-version-combined.hex',
    2: 'firmware/MICROBIT.hex',
    universal: 'firmware/universal-hex.hex',
  };

  private static outputOrigin = HexOrigin.UNKNOWN;
  private static inputOrigin = HexOrigin.UNKNOWN;

  private static outputHandler = new OutputMicrobitHandler(stores.getDevices());
  private static inputHandler = new CombinedMicrobitHandler(
    this.outputHandler,
    stores.getDevices(),
  );

  private static linkedMicrobit: Microbit = new Microbit();

  /**
   * Whether the microbit assigned as input is currently connected
   */
  public static isInputConnected(): boolean {
    return this.getInput().getDeviceState() === MicrobitDeviceState.CONNECTED;
  }

  /**
   * Whether the microbit assigned as output is currently connected
   */
  public static isOutputConnected(): boolean {
    return this.getOutput().getDeviceState() === MicrobitDeviceState.CONNECTED;
  }

  /**
   * The input MicrobitBluetooth object
   */
  public static getInput(): Microbit {
    return this.microbits[this.inputIndexRef];
  }

  /**
   * The output MicrobitBluetooth object
   */
  public static getOutput(): Microbit {
    return this.microbits[this.outputIndexRef];
  }

  public static setOutputOrigin(origin: HexOrigin) {
    this.outputOrigin = origin;
  }

  public static setInputOrigin(origin: HexOrigin) {
    this.inputOrigin = origin;
  }

  /**
   * Attempts to assign and connect via bluetooth, using the given name.
   * If no name is given, it will search for any nearby microbit.
   */
  public static async connectInput(name?: string) {
    Logger.log('Microbits', 'connectToInput', 'Connecting to input microbit');
    const bluetoothDevice = new MicrobitBluetoothDevice();
    this.inputIndexRef = 0;
    this.getInput().setDevice(bluetoothDevice);
    this.getInput().setHandler(this.inputHandler);
    this.getInput().setAutoReconnect(true);
    await bluetoothDevice.connect(name);
  }

  /**
   * Attempts to connect to a microbit, using it as output.
   * If no name is provided, it will search for any nearby micro:bit.
   */
  public static async connectOutput(name?: string): Promise<void> {
    Logger.log('Microbits', 'connectToInput', 'Connecting to input microbit');
    const bluetoothDevice = new MicrobitBluetoothDevice();
    this.getOutput().setDevice(bluetoothDevice);
    this.getOutput().setHandler(this.outputHandler);
    this.getOutput().setAutoReconnect(true);
    await bluetoothDevice.connect(name);
    if (this.isInputOutputTheSame()) {
      this.outputIndexRef = 0;
    } else {
      this.outputIndexRef = 1;
    }
  }

  /**
   * Compares the input/output bluetooth device IDs to determine if they are the same device.
   */
  public static isInputOutputTheSame(): boolean {
    if (!this.getInput().getId() || !this.getOutput().getId()) {
      return false;
    }
    return this.getInput().getId() === this.getOutput().getId();
  }

  /**
   * Expels the output and output microbit, disconnecting it without attempting to reconnect.
   * If the function is called while the micro:bit is reconnecting, it will be disconnected as soon as it has connected.
   * @throws {Error} Throws an error if no micro:bit is assigned.
   */
  public static disconnectInputAndOutput() {
    this.disconnectInput();
    this.disconnectOutput();
  }

  /**
   * Expels the output microbit, disconnecting it without attempting to reconnect.
   * If the function is called while the micro:bit is reconnecting, it will be disconnected as soon as it has connected.
   * @throws {Error} Throws an error if no output micro:bit is assigned.
   */
  public static disconnectOutput() {
    Logger.log('Microbits', 'Attempting to disconnect output');
    if (this.isInputOutputTheSame()) {
      this.outputHandler.onDisconnected();
      this.outputHandler.onClosed();
      this.outputIndexRef = 1;
    } else {
      this.getOutput().disconnect();
    }
  }

  /**
   * Expels the input microbit, disconnecting it without attempting to reconnect.
   * If the function is called while the micro:bit is reconnecting, it will be disconnected as soon as it has connected.
   * @throws {Error} Throws an error if no input micro:bit is assigned.
   */
  public static disconnectInput() {
    this.getInput().disconnect();
  }

  /**
   * @param { { pin: number; on: boolean }[] } data The pins and their states
   * @throws {Error} Throws an error if no output microbit is assigned, or no outputIO service could be found.
   */
  public static async sendToOutputPin(data: { pin: MBSpecs.UsableIOPin; on: boolean }[]) {
    for (const state of data) {
      await this.getOutput().setIOPin(state.pin, state.on);
    }
  }

  public static async resetIOPins() {
    for (const pin of StaticConfiguration.supportedPins) {
      await this.getOutput().setIOPin(pin, false);
    }
  }

  public static async setOutputMatrix(matrix: boolean[]) {
    if (this.getOutput().getDeviceState() !== MicrobitDeviceState.CONNECTED) {
      return;
    }
    const vecMat: boolean[][] = [[], [], [], [], []];
    for (let i = 0; i < matrix.length; i++) {
      const element = matrix[i];
      const row = Math.floor(i / 5);
      vecMat[row].push(element);
    }
    await this.getOutput().setLEDMatrix(vecMat);
  }

  public static useInputAsOutput() {
    if (this.getInput().getDeviceState() === MicrobitDeviceState.CLOSED) {
      throw new Error('The input micro:bit is not');
    }
    const inputDevice = this.getInput().getDevice();
    if (!inputDevice) {
      throw new Error('Cannot use input as output. Input has no MicrobitDevice!');
    }
    this.outputIndexRef = 0;
    this.outputOrigin = this.inputOrigin;

    this.getOutput().getHandler()?.onConnecting(); // Might contain some setup.
    this.getOutput().getHandler()?.onConnected(this.getInput().getLastVersion());
    // Remaining ad-hoc logic handled by the input handler
  }

  /**
   * Sends a message through UART
   * @param type The type of UART message, i.e 'g' for gesture and 's' for sound
   * @param value The message
   */
  private static async sendToOutputUart(type: UARTMessageType, value: string) {
    await this.getOutput().sendMessage(`${type}_${value}`);
  }

  /**
   * @deprecated For older versions of hex files. Will be removed in the future
   */
  private static sendLegacySoundMessage(value: string) {
    this.getOutput().sendMessage(`s${value}`);
  }

  /**
   * Sends a sound type message, using UART
   * @param value The sound ID
   */
  public static sendUARTSoundMessageToOutput(value: string) {
    this.sendToOutputUart('s', value);
    this.sendLegacySoundMessage(value);
  }

  /**
   * Sends a gesture type message, using UART
   * @param value The gesture name
   */
  public static async sendUARTGestureMessageToOutput(value: string) {
    await this.sendToOutputUart('g', `${value}`);
  }

  /**
   * Attempts to create a connection to a USB-connected microbit
   * @returns Whether a microbit was successfully connected
   */
  public static async linkMicrobit() {
    await this.linkedMicrobit.getUsbController().connect();
  }

  /**
   * Gets the microbit connected through USB.
   * @returns The USB-Connected microbit
   */
  public static getLinked(): Microbit {
    return this.linkedMicrobit;
  }

  /**
   * Attempt to disconnect a USB-connected microbit
   */
  public static async unlinkMicrobit() {
    this.getLinked().getUsbController().disconnect();
  }

  /**
   * Whether the output microbit is a makecode hex.
   * @returns True if the output microbit is from Makecode.
   */
  public static isOutputMakecode() {
    return this.outputOrigin === HexOrigin.MAKECODE;
  }

  /**
   * Whether the input microbit is a makecode hex,
   * @returns True if the input microbit is from Makecode.
   */
  public static isInputMakecode() {
    return this.inputOrigin === HexOrigin.MAKECODE;
  }

  /**
   * Flashes the appropriate hex file to the micro:bit which is connected via USB
   * @param progressCallback The callback that is fired each time the progress status is updated
   */
  public static async flashHexToLinked(
    progressCallback: (progress: number) => void,
  ): Promise<void> {
    const version = this.getLinked().getUsbController().getModelNumber();
    const hexFileName = this.hexFiles[version]; // Note: For this we CANNOT use the universal hex file (don't know why)
    const hexFile = await fetch(hexFileName);
    const hex = await hexFile.arrayBuffer();

    await this.linkedMicrobit.getUsbController().flashHex(hex, progressCallback);
  }

  public static async getLinkedFriendlyName(): Promise<string> {
    return await this.linkedMicrobit.getUsbController().getFriendlyName();
  }

  public static getInputOrigin(): HexOrigin {
    return this.inputOrigin;
  }

  public static getOutputOrigin(): HexOrigin {
    return this.outputOrigin;
  }
}

export default Microbits;

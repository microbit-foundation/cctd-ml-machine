/**
 * Entrypoint for the Microbit facade pattern
 */
import ConnectionBehaviours from '../connection-behaviours/ConnectionBehaviours';
import { get, writable } from 'svelte/store';
import MBSpecs from './MBSpecs';
import MicrobitBluetooth from './MicrobitBluetooth';
import { outputting } from '../stores/uiStore';
import MicrobitUSB from './MicrobitUSB';
import type ConnectionBehaviour from '../connection-behaviours/ConnectionBehaviour';
import TypingUtils from '../TypingUtils';
import StaticConfiguration from '../../StaticConfiguration';

type QueueElement = {
  service: BluetoothRemoteGATTCharacteristic;
  view: DataView;
};

/**
 * Entry point for microbit interfaces / Facade pattern
 */
class Microbits {
  public static hexFiles: { 1: string; 2: string; universal: string } = {
    1: 'firmware/ml-microbit-cpp-version-combined.hex',
    2: 'firmware/MICROBIT.hex',
    universal: 'firmware/universal-hex.hex',
  };
  private static assignedInputMicrobit: MicrobitBluetooth | undefined = undefined;
  private static assignedOutputMicrobit: MicrobitBluetooth | undefined = undefined;
  private static inputName: string | undefined = undefined;
  private static outputName: string | undefined = undefined;
  private static inputVersion: MBSpecs.MBVersion | undefined;
  private static outputVersion: MBSpecs.MBVersion | undefined;
  private static linkedMicrobit: MicrobitUSB | undefined = undefined;

  private static outputIO: BluetoothRemoteGATTCharacteristic | undefined;
  private static outputMatrix: BluetoothRemoteGATTCharacteristic | undefined;
  private static outputUart: BluetoothRemoteGATTCharacteristic | undefined;

  private static isInputReconnecting = false;
  private static isOutputReconnecting = false;

  // Set these flags if user disconnects while reconnecting, such that the GATT server can be disconnected when
  // the micro:bit reestablishes a connection.
  private static inputFlaggedForDisconnect = false;
  private static outputFlaggedForDisconnect = false;

  private static bluetoothServiceActionQueue = writable<{
    busy: boolean;
    queue: QueueElement[];
  }>({
    busy: false,
    queue: [],
  });

  /**
   * Whether an input micro:bit is assigned
   */
  public static isInputAssigned(): boolean {
    return this.assignedInputMicrobit !== undefined;
  }

  /**
   * Downloads the universal HEX on the users' computer.
   */
  public static downloadFirmware(): void {
    const a = document.createElement('a');
    a.href = Microbits.hexFiles.universal;
    a.download = StaticConfiguration.downloadedHexFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Whether the microbit assigned as input is currently connected
   */
  public static isInputConnected(): boolean {
    if (!this.isInputAssigned()) {
      return false;
    }
    return this.getInput().isConnected();
  }

  /**
   * Whether an output micro:bit is assigned
   */
  public static isOutputAssigned(): boolean {
    return this.assignedOutputMicrobit !== undefined;
  }

  /**
   * Whether the microbit assigned as output is currently connected
   */
  public static isOutputConnected(): boolean {
    if (!this.isOutputAssigned()) {
      return false;
    }
    return this.getOutput().isConnected();
  }

  /**
   * Whether the microbit assigned as output is currently connected
   */
  public static isOutputReady(): boolean {
    if (!this.isOutputConnected()) {
      return false;
    }
    return !(!this.outputMatrix && !this.outputIO && !this.outputUart);
  }

  /**
   * Whether a micro:bit is linked (via USB)
   */
  public static isMicrobitLinked(): boolean {
    return this.linkedMicrobit !== undefined;
  }

  /**
   * The input MicrobitBluetooth object
   */
  public static getInput(): MicrobitBluetooth {
    if (!this.isInputAssigned() || !this.assignedInputMicrobit) {
      throw new Error('Cannot get input microbit, it is not assigned!');
    }
    return this.assignedInputMicrobit;
  }

  /**
   * The output MicrobitBluetooth object
   */
  public static getOutput(): MicrobitBluetooth {
    if (!this.isOutputAssigned() || !this.assignedOutputMicrobit) {
      throw new Error('Cannot get output microbit, it is not assigned!');
    }
    return this.assignedOutputMicrobit;
  }

  /**
   * Attempts to assign and connect via bluetooth.
   * @param name The expected name of the microbit.
   * @return Returns true if the connection was successful, else false.
   */
  public static async assignInput(name: string): Promise<boolean> {
    if (name.length !== 5) {
      throw new Error('Could not connect, the name specified must be of length 5!');
    }
    const connectionBehaviour = ConnectionBehaviours.getInputBehaviour();

    const onInitialInputConnect = (microbit: MicrobitBluetooth) => {
      this.assignedInputMicrobit = microbit;
      this.inputName = name;
      connectionBehaviour.onConnected(name);
      Microbits.listenToInputServices()
        .then(() => {
          connectionBehaviour.onReady();
        })
        .catch(reason => {
          console.log(reason);
        });
    };

    const onInputDisconnect = (manual?: boolean) => {
      if (this.isInputOutputTheSame()) {
        ConnectionBehaviours.getOutputBehaviour().onDisconnected();
      }
      if (manual) {
        if (this.isInputAssigned()) {
          ConnectionBehaviours.getInputBehaviour().onExpelled(manual, true);
          ConnectionBehaviours.getOutputBehaviour().onExpelled(manual, true);
          this.clearAssignedOutputReference();
          this.clearAssignedInputReference();
        }
      } else {
        connectionBehaviour.onDisconnected();
        this.isInputReconnecting = true;
      }
      this.clearBluetoothServiceActionQueue();
    };

    const onInputReconnect = (microbit: MicrobitBluetooth) => {
      this.isInputReconnecting = false;
      if (this.inputFlaggedForDisconnect) {
        // User has disconnected during the reconnect process,
        // and the connection was reestablished, disconnect safely
        void this.disconnectInputSafely(microbit);
        this.inputFlaggedForDisconnect = false;
        return;
      }
      this.inputName = name;
      this.assignedInputMicrobit = microbit;
      if (this.isInputOutputTheSame()) {
        ConnectionBehaviours.getOutputBehaviour().onConnected(name);
      }
      connectionBehaviour.onConnected(name);
      Microbits.listenToInputServices()
        .then(() => {
          if (this.isInputOutputTheSame()) {
            this.assignedOutputMicrobit = microbit;
            this.inputName = name;
            Microbits.listenToOutputServices()
              .then(() => {
                connectionBehaviour.onReady();
                ConnectionBehaviours.getOutputBehaviour().onReady();
              })
              .catch(reason => {
                console.log(reason);
              });
          } else {
            connectionBehaviour.onReady();
          }
        })
        .catch(reason => {
          console.log(reason);
        });
    };

    const onInputReconnectFailed = () => {
      ConnectionBehaviours.getInputBehaviour().onExpelled(false, true);
      ConnectionBehaviours.getOutputBehaviour().onExpelled(false, true);
      this.clearAssignedOutputReference();
    };

    try {
      const request = await MicrobitBluetooth.requestDevice(
        name,
        this.onFailedConnection(connectionBehaviour),
      );
      await MicrobitBluetooth.createMicrobitBluetooth(
        request,
        onInitialInputConnect,
        onInputDisconnect,
        this.onFailedConnection(connectionBehaviour),
        onInputReconnect,
        onInputReconnectFailed,
      );

      connectionBehaviour.onAssigned(this.getInput(), name);
      this.inputName = name;
      this.inputVersion = this.getInput().getVersion();
      return true;
    } catch (e) {
      console.log(e);
      this.onFailedConnection(connectionBehaviour)(e as Error);
    }
    return false;
  }

  /**
   * For some reason, the function getPrimaryServices bricks if we do not listen to services before disconnecting
   * GATT server. Therefore, this function must be called if we intend to disconnect before listening to services
   * @param microbit The microbit we wish to disconnect from
   * @private
   */
  private static async disconnectInputSafely(microbit: MicrobitBluetooth): Promise<void> {
    await microbit.listenToAccelerometer(TypingUtils.emptyFunction);
    await microbit.listenToButton('A', TypingUtils.emptyFunction);
    await microbit.listenToButton('B', TypingUtils.emptyFunction);
    microbit.disconnect();
  }

  private static async listenToInputServices(): Promise<void> {
    const connectionBehaviour = ConnectionBehaviours.getInputBehaviour();
    if (!this.isInputConnected()) {
      throw new Error('Could not listen to services, no microbit connected!');
    }
    await this.getInput().listenToAccelerometer(
      connectionBehaviour.accelerometerChange.bind(connectionBehaviour),
    );
    await this.getInput().listenToButton(
      'A',
      connectionBehaviour.buttonChange.bind(connectionBehaviour),
    );
    await this.getInput().listenToButton(
      'B',
      connectionBehaviour.buttonChange.bind(connectionBehaviour),
    );
  }

  /**
   * Attempts to assign and connect via bluetooth.
   * @param name The expected name of the microbit.
   * @return Returns true if the connection was successful, else false.
   */
  public static async assignOutput(name: string): Promise<boolean> {
    console.assert(name.length == 5);

    const connectionBehaviour: ConnectionBehaviour =
      ConnectionBehaviours.getOutputBehaviour();

    const onInitialOutputConnect = (microbit: MicrobitBluetooth) => {
      this.assignedOutputMicrobit = microbit;
      connectionBehaviour.onConnected(name);
      this.listenToOutputServices()
        .then(() => {
          connectionBehaviour.onReady();
        })
        .catch(e => {
          console.log(e);
        });
    };

    const onOutputDisconnect = (manual?: boolean) => {
      if (manual) {
        if (this.isOutputAssigned()) {
          ConnectionBehaviours.getOutputBehaviour().onExpelled(manual);
          this.clearAssignedOutputReference();
        }
      } else {
        this.isOutputReconnecting = true;
        ConnectionBehaviours.getOutputBehaviour().onDisconnected();
      }
      this.clearBluetoothServiceActionQueue();
    };

    const onOutputReconnect = (microbit: MicrobitBluetooth) => {
      this.isOutputReconnecting = false;
      if (this.outputFlaggedForDisconnect) {
        this.outputFlaggedForDisconnect = false;
        void this.disconnectOutputSafely(microbit);
        return;
      }
      this.assignedOutputMicrobit = microbit;
      connectionBehaviour.onConnected(name);
      this.listenToOutputServices()
        .then(() => {
          connectionBehaviour.onReady();
        })
        .catch(e => {
          console.log(e);
        });
    };

    const onOutputReconnectFailed = () => {
      connectionBehaviour.onExpelled(false, false);
    };

    try {
      const bluetoothDevice = await MicrobitBluetooth.requestDevice(
        name,
        this.onFailedConnection(connectionBehaviour),
      );
      await MicrobitBluetooth.createMicrobitBluetooth(
        bluetoothDevice,
        onInitialOutputConnect,
        onOutputDisconnect,
        this.onFailedConnection(connectionBehaviour),
        onOutputReconnect,
        onOutputReconnectFailed,
      );
      connectionBehaviour.onAssigned(this.getOutput(), name);
      this.outputName = name;
      this.outputVersion = this.getOutput().getVersion();
      return true;
    } catch (e) {
      this.onFailedConnection(connectionBehaviour)(e as Error);
    }
    return false;
  }

  private static onFailedConnection(behaviour: ConnectionBehaviour) {
    return (err: Error) => {
      if (err) {
        if (
          err.message &&
          err.message.includes('User cancelled the requestDevice() chooser')
        ) {
          // User just cancelled
          behaviour.onCancelledBluetoothRequest();
        } else {
          behaviour.onBluetoothConnectionError(err);
        }
      } else {
        behaviour.onBluetoothConnectionError('Unknown error');
      }
    };
  }

  /**
   * For some reason, the function getPrimaryServices bricks if we do not listen to services before disconnecting
   * GATT server. Therefore, this function must be called if we intend to disconnect before listening to services
   * @param microbit The microbit we wish to disconnect from
   * @private
   */
  private static async disconnectOutputSafely(
    microbit: MicrobitBluetooth,
  ): Promise<void> {
    await this.getIOOf(microbit);
    await this.getMatrixOf(microbit);
    const uartService = await microbit.getUARTService();
    await uartService.getCharacteristic(MBSpecs.Characteristics.UART_DATA_RX);
    microbit.disconnect();
  }

  private static async listenToOutputServices(): Promise<void> {
    if (!this.isOutputConnected()) {
      throw new Error('Could not listen to services, no microbit connected!');
    }
    this.outputIO = await this.getIOOf(this.getOutput());
    this.outputMatrix = await this.getMatrixOf(this.getOutput());
    const uartService = await this.getOutput().getUARTService();
    this.outputUart = await uartService.getCharacteristic(
      MBSpecs.Characteristics.UART_DATA_RX,
    );
  }

  /**
   * Returns the reference to the connected output microbit. Throws error if none are connected.
   */
  public static getAssignedOutput(): MicrobitBluetooth {
    if (!this.assignedOutputMicrobit) {
      throw new Error('No output microbit has been assigned!');
    }
    return this.assignedOutputMicrobit;
  }

  /**
   * Returns the reference to the connected input microbit. Throws error if none are connected.
   */
  public static getAssignedInput(): MicrobitBluetooth {
    if (!this.assignedInputMicrobit) {
      throw new Error('No input microbit has been assigned!');
    }
    return this.assignedInputMicrobit;
  }

  /**
   * Compares the input/output bluetooth device IDs to determine if they are the same device.
   */
  public static isInputOutputTheSame() {
    if (!this.isOutputAssigned() || !this.isInputAssigned()) {
      return false;
    }
    return this.getInput().getDevice().id == this.getOutput().getDevice().id;
  }

  /**
   * Expels both the input and output.
   */
  public static expelInputAndOutput() {
    if (!this.isInputAssigned() && !this.isOutputAssigned()) {
      throw new Error('Could not disconnect microbits, none have been connected yet!');
    }

    if (this.isInputOutputTheSame()) {
      // If they are the same, it suffices to disconnect one of them, doesn't matter which(in or output).
      ConnectionBehaviours.getInputBehaviour().onExpelled(true, true);
      ConnectionBehaviours.getOutputBehaviour().onExpelled(true, true);
      this.disconnectOrFlagInputGATT();
    } else {
      // Input and output are not the same, expel both of them
      if (this.isOutputAssigned()) {
        ConnectionBehaviours.getOutputBehaviour().onExpelled(true, true);
        this.disconnectOrFlagOutputGATT();
      }
      if (this.isInputAssigned()) {
        ConnectionBehaviours.getInputBehaviour().onExpelled(true, true);
        this.disconnectOrFlagInputGATT();
      }
    }
    this.clearAssignedInputReference();
    this.clearAssignedOutputReference();
  }

  public static expelOutput() {
    if (!this.isOutputAssigned()) {
      throw new Error('Cannot disconnect, no output micro:bit is connected');
    }
    ConnectionBehaviours.getOutputBehaviour().onExpelled(true);
    if (this.isInputOutputTheSame()) {
      this.clearAssignedOutputReference();
      void this.setGladSmiley(this.getInput());
    } else {
      this.disconnectOrFlagOutputGATT();
      this.clearAssignedOutputReference();
    }
  }

  public static expelInput() {
    if (!this.isInputAssigned()) {
      throw new Error('Cannot disconnect, no input micro:bit is connected');
    }
    ConnectionBehaviours.getInputBehaviour().onExpelled(true);
    if (this.isInputOutputTheSame()) {
      this.expelInputAndOutput();
    } else {
      this.disconnectOrFlagInputGATT();
      this.clearAssignedInputReference();
    }
  }

  public static sendToOutputPin(data: { pin: number; on: boolean }[]) {
    // todo: isn't part of the feature set for DR, not tested
    if (!this.isOutputAssigned()) {
      throw new Error('No output microbit is connected, cannot send to pin.');
    }

    if (!this.outputIO) {
      throw new Error(
        'Cannot send to output pin, have not subscribed to the IO service yet!',
      );
    }
    const dataView = new DataView(new ArrayBuffer(data.length * 2));
    data.forEach((point: { pin: number; on: boolean }, index) => {
      dataView.setInt8(index * 2, point.pin);
      dataView.setInt8(index * 2 + 1, point.on ? 1 : 0);
      outputting.set({ text: `Turn pin ${point.pin} ${point.on ? 'on' : 'off'}` });
    });
    this.addToServiceActionQueue(this.outputIO, dataView);
  }

  public static setOutputMatrix(matrix: boolean[]) {
    if (!this.isOutputAssigned()) {
      throw new Error('No output microbit is connected, cannot set matrix.');
    }
    if (!this.outputMatrix) {
      throw new Error(
        'Cannot send to output matrix, have not subscribed to the matrix service yet!',
      );
    }
    const dataView = new DataView(new ArrayBuffer(5));
    for (let i = 0; i < 5; i++) {
      dataView.setUint8(
        i,
        this.subarray(matrix, i * 5, 5 + i * 5).reduce(
          (byte, bool) => (byte << 1) | (bool ? 1 : 0),
          0,
        ),
      );
    }
    this.addToServiceActionQueue(this.outputMatrix, dataView);
  }

  public static useInputAsOutput() {
    if (!this.isInputAssigned()) {
      throw new Error(
        'No input microbit has be defined! Please check that it is connected before using it',
      );
    }
    if (!this.inputName) {
      throw new Error(
        'Something went wrong. Input microbit was specified, but without name!',
      );
    }
    this.assignedOutputMicrobit = this.getInput();
    this.outputName = this.inputName;
    this.outputVersion = this.inputVersion;
    ConnectionBehaviours.getOutputBehaviour().onAssigned(
      this.getOutput(),
      this.outputName,
    );
    ConnectionBehaviours.getOutputBehaviour().onConnected(this.outputName);
    this.listenToOutputServices()
      .then(() => {
        ConnectionBehaviours.getOutputBehaviour().onReady();
      })
      .catch(e => {
        console.log(e);
      });
  }

  public static getInputVersion(): MBSpecs.MBVersion {
    if (!this.inputVersion) {
      throw new Error('No version has been set, has the micro:bit been connected?');
    }

    return this.inputVersion;
  }

  public static getOutputVersion(): MBSpecs.MBVersion {
    if (!this.outputVersion) {
      throw new Error('No version has been set, has the micro:bit been connected?');
    }

    return this.outputVersion;
  }

  public static getOutputName(): string {
    if (!this.outputName) {
      throw new Error('No name has been set, has the micro:bit connected?');
    }
    return this.outputName;
  }

  public static getInputName(): string {
    if (!this.inputName) {
      throw new Error('No name has been set, has the micro:bit connected?');
    }
    return this.inputName;
  }

  public static sendToOutputUart(type: string, value: string) {
    if (!this.assignedOutputMicrobit) {
      throw new Error('No output microbit has been set');
    }

    if (!this.outputUart) {
      throw new Error('Cannot send to uart. Have not subscribed to UART service yet!');
    }

    const view = new DataView(new ArrayBuffer(2 + value.length));

    view.setUint8(0, type.charCodeAt(0));
    for (let i = 0; i < value.length; i++) {
      view.setUint8(i + 1, value.charCodeAt(i));
    }
    view.setUint8(1 + value.length, '#'.charCodeAt(0));

    this.addToServiceActionQueue(this.outputUart, view);
  }

  public static async linkMicrobit() {
    try {
      this.linkedMicrobit = await MicrobitUSB.requestConnection();
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }

  public static getLinked(): MicrobitUSB {
    if (!this.isMicrobitLinked() || !this.linkedMicrobit) {
      throw new Error('No microbit has been linked!');
    }

    return this.linkedMicrobit;
  }

  public static async unlinkMicrobit() {
    if (!this.isMicrobitLinked()) {
      throw new Error('Cannot disconnect USB. No USB microbit could be found');
    }
    await this.getLinked().disconnect();
  }

  /**
   * Flashes the appropriate hex file to the micro:bit which is connected via USB
   * @param progressCallback The callback that is fired each time the progress status is updated
   */
  public static flashHexToLinked(progressCallback: (progress: number) => void) {
    if (!this.isMicrobitLinked()) {
      throw new Error('Cannot flash to USB, none are connected!');
    }
    const version = this.getLinked().getModelNumber();
    const hex = this.hexFiles[version]; // Note: For this we CANNOT use the universal hex file (don't know why)
    return this.getLinked().flashHex(hex, progressCallback);
  }

  public static async getLinkedFriendlyName() {
    if (!this.isMicrobitLinked()) {
      throw new Error('Cannot get friendly name from USB, none are connected!');
    }
    return await this.getLinked().getFriendlyName();
  }

  /**
   * Disconnects the GATT server, if available. Otherwise, it will be flagged for disconnect when it connects.
   * @private
   */
  private static disconnectOrFlagInputGATT() {
    if (!this.assignedInputMicrobit) {
      throw new Error('No input micro:bit could be found while disconnecting from GATT');
    }
    if (this.isInputReconnecting) {
      this.inputFlaggedForDisconnect = true;
    } else {
      this.assignedInputMicrobit.disconnect();
    }
  }

  /**
   * Disconnects the GATT server, if available. Otherwise, it will be flagged for disconnect when it connects.
   * @private
   */
  private static disconnectOrFlagOutputGATT() {
    if (!this.assignedOutputMicrobit) {
      throw new Error('No output micro:bit could be found while disconnecting from GATT');
    }
    if (this.isOutputReconnecting) {
      this.outputFlaggedForDisconnect = true;
    } else {
      this.assignedOutputMicrobit.disconnect();
    }
  }

  /**
   * Clears any held references to output microbit objects
   * @private
   */
  private static clearAssignedOutputReference() {
    this.assignedOutputMicrobit = undefined;
    this.outputName = undefined;
    this.outputVersion = undefined;
    this.outputIO = undefined;
    this.outputUart = undefined;
    this.outputMatrix = undefined;
  }

  /**
   * Clears any held references to output microbit objects
   * @private
   */
  private static clearAssignedInputReference() {
    this.assignedInputMicrobit = undefined;
    this.inputName = undefined;
    this.inputVersion = undefined;
  }

  private static addToServiceActionQueue(
    service: BluetoothRemoteGATTCharacteristic,
    view: DataView,
  ) {
    this.bluetoothServiceActionQueue.update(update => {
      update.queue.push({ service, view });
      return update;
    });
    this.processServiceActionQueue();
  }

  private static processServiceActionQueue() {
    if (
      get(this.bluetoothServiceActionQueue).busy ||
      get(this.bluetoothServiceActionQueue).queue.length == 0
    )
      return;
    get(this.bluetoothServiceActionQueue).busy = true;
    const { service, view } = get(this.bluetoothServiceActionQueue).queue.shift() ?? {
      service: undefined,
      view: undefined,
    };
    if (service === undefined) {
      throw new Error(
        'Could not process the service queue, an element in the queue was not provided with a service to execute on.',
      );
    }
    service
      .writeValue(view)
      .then(() => {
        get(this.bluetoothServiceActionQueue).busy = false;
        this.processServiceActionQueue();
      })
      .catch(err => {
        // Catches a characteristic not found error, preventing further output.
        // Why does this happens is not clear
        console.log(err);
        if (err) {
          if ((err as DOMException).message.includes('GATT Service no longer exists')) {
            this.listenToOutputServices()
              .then(() => {
                console.log('Attempted to fix missing gatt!');
              })
              .catch(() => {
                console.error(
                  'Failed to fix missing GATT service issue. Uncharted territory',
                );
              });
          }
        }
        get(this.bluetoothServiceActionQueue).busy = false;
        this.processServiceActionQueue();
      });
  }

  private static async getMatrixOf(
    mb: MicrobitBluetooth,
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    if (!mb) {
      throw new Error('Cannot get matrix of undefined microbit');
    }
    const LEDService = await mb.getLEDService();
    return await LEDService.getCharacteristic(MBSpecs.Characteristics.LED_MATRIX_STATE);
  }

  private static async getIOOf(
    mb: MicrobitBluetooth,
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    if (!mb) {
      throw new Error('Cannot get IO of undefined microbit.');
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

  private static clearBluetoothServiceActionQueue() {
    this.bluetoothServiceActionQueue.set({ busy: false, queue: [] });
  }

  private static async setGladSmiley(mb: MicrobitBluetooth) {
    try {
      await mb.setLEDMatrix([
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
      ]);
    } catch (e) {
      console.log(e);
    }
  }
}

export default Microbits;

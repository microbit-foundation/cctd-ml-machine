import type MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import MBSpecs from "../microbit-interfacing/MBSpecs";

/**
 * Contract for the behaviour of micro:bit connections.
 */
interface ConnectionBehaviour {

	/**
	 * What should happen when the micro:bit is disconnected.
	 */
	bluetoothDisconnect(manual?: boolean, bothDisconnected?: boolean): void;

	/**
	 * What should happen on a bluetooth error. Usually occurs because of cancelled device requests.
	 * @param {Error} error
	 *      Error message
	 */
	bluetoothConnectionError(error?: Error): void;

	/**
	 * What should happen when the micro:bit is connected via bluetooth
	 * @param {MicrobitBluetooth} microbitBluetooth
	 *      The connected micro:bit.
	 * @param {string} name
	 *      The name of the micro:bit.
	 */
	bluetoothConnect(microbitBluetooth: MicrobitBluetooth, name: string): void;

	/**
	 * Should return whether the micro:bit is connected.
	 */
	isConnected(): boolean;

	/**
	 * What should happen when the accelerometer changes.
	 */
	accelerometerChange(x: number, y: number, z: number): void;

	/**
	 * What should happen when the button changes.
	 */
	buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void;
}

export default ConnectionBehaviour;
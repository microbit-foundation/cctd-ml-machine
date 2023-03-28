import type MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import MBSpecs from "../microbit-interfacing/MBSpecs";

/**
 * Contract for the behaviour of micro:bit connections.
 */
interface ConnectionBehaviour {

	/**
	 * What should happen when the micro:bit is expelled.
	 */
	onExpelled(manual?: boolean, bothExpelled?: boolean): void;

	/**
	 * What should happen when the bluetooth device request is cancelled
	 */
	onCancelledBluetoothRequest(): void;

	/**
	 * What should happen when the micro:bit is assigned
	 * @param {MicrobitBluetooth} microbit
	 *      The assigned micro:bit.
	 * @param {string} name
	 *      The name of the micro:bit.
	 */
	onAssigned(microbit: MicrobitBluetooth, name: string): void;

	/**
	 * What should happen when the micro:bit gets connected via Bluetooth
	 * @param name Name of the micro:bit
	 */
	onConnected(name: string): void;

	/**
	 * What should happen when the microbit is ready?
	 * (Has subscribed to all services)
	 */
	onReady(): void;

	/**
	 * What should happen when the micro:bit loses connection via Bluetooth
	 */
	onDisconnected(): void;

	/**
	 * What should happen when the micro:bit loses connection via Bluetooth
	 */
	onBluetoothConnectionError(error?: unknown): void;

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
import type ConnectionBehaviour from "./ConnectionBehaviour";
import type MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import { alertUser, buttonPressed, DeviceRequestStates, informUser, state } from "../stores/uiStore";
import { livedata } from "../stores/mlStore";
import { t } from "../../i18n";
import { get } from "svelte/store";
import MBSpecs from "../microbit-interfacing/MBSpecs";
import LoggingDecorator from "./LoggingDecorator";
import Microbits from "../microbit-interfacing/Microbits";

let text = get(t);
t.subscribe((t) => (text = t));

/**
 * Implementation of the input ConnectionBehaviour
 */
class InputBehaviour extends LoggingDecorator {

	private smoothedAccelX = 0;
	private smoothedAccelY = 0;
	private smoothedAccelZ = 0;

	private reconnectTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {/*empty*/},0);
	private timeout = 4000;

	onReady() {
		super.onReady();
		clearTimeout(this.reconnectTimeout)
		console.log("timeout cleared")
	}

	onAssigned(microbitBluetooth: MicrobitBluetooth, name: string) {
		super.onAssigned(microbitBluetooth, name)
	}

	onExpelled(manual?: boolean, bothDisconnected?: boolean): void {
		super.onExpelled(manual, bothDisconnected)
		state.update((s) => {
			s.isConnected = false;
			s.offerReconnect = !manual;
			s.reconnectState = DeviceRequestStates.INPUT;
			return s;
		});
	}

	onCancelledBluetoothRequest(): void {
		super.onCancelledBluetoothRequest()
		state.update((s) => {
			s.requestDeviceWasCancelled = true;
			s.isConnected = false;
			return s;
		});
	}

	onDisconnected(): void {
		super.onDisconnected()
		state.update((s) => {
			s.isConnected = false;
			s.offerReconnect = false;
			s.reconnectState = DeviceRequestStates.NONE;
			return s;
		});
	}

	onConnected(name: string): void {
		super.onConnected(name)
		informUser(text("alert.micro.GATTserverInform"));
		informUser(text("alert.micro.microBitServiceInform"));
		informUser(text("alert.micro.gettingDataInform"));
		state.update((s) => {
			s.isConnected = true;
			s.isRequestingDevice = DeviceRequestStates.NONE;
			s.offerReconnect = false;
			return s;
		});

		// Reset connection timeout
		clearTimeout(this.reconnectTimeout)
		const catastrophic = () => this.onCatastrophicError();
		this.reconnectTimeout = setTimeout(function() {
			catastrophic();
		}, this.timeout)

		informUser(text("alert.micro.nowConnectedInform"));
	}

	accelerometerChange(x: number, y: number, z: number): void {
		super.accelerometerChange(x,y,z)

		const accelX = x / 1000.0;
		const accelY = y / 1000.0;
		const accelZ = z / 1000.0;
		this.smoothedAccelX = accelX * 0.25 + this.smoothedAccelX * 0.75;
		this.smoothedAccelY = accelY * 0.25 + this.smoothedAccelY * 0.75;
		this.smoothedAccelZ = accelZ * 0.25 + this.smoothedAccelZ * 0.75;

		livedata.set({
			accelX,
			accelY,
			accelZ,
			smoothedAccelX: this.smoothedAccelX,
			smoothedAccelY: this.smoothedAccelY,
			smoothedAccelZ: this.smoothedAccelZ
		});
	}

	buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {
		super.buttonChange(buttonState, button)
		if (buttonState === MBSpecs.ButtonStates.Released) return;
		if (button === "A") {
			buttonPressed.update((obj) => {
				obj.buttonA = 1;
				obj.buttonB = 0;
				return obj;
			});
		} else {
			buttonPressed.update((obj) => {
				obj.buttonA = 0;
				obj.buttonB = 1;
				return obj;
			});
		}
	}

	/**
	 * This is in case of an unrecoverable reconnect failure due to a bug in chrome/chromium
	 * Refresh the page is the only known resolution
	 * @private
	 */
	private onCatastrophicError() {
		location.reload();
	}
}

export default InputBehaviour;

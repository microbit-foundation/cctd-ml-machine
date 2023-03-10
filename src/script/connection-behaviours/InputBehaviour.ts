import type ConnectionBehaviour from "./ConnectionBehaviour";
import type MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import { alertUser, buttonPressed, DeviceRequestStates, informUser, state } from "../stores/uiStore";
import { livedata } from "../stores/mlStore";
import { t } from "../../i18n";
import { get } from "svelte/store";
import MBSpecs from "../microbit-interfacing/MBSpecs";

let text = get(t);
t.subscribe((t) => (text = t));

/**
 * Implementation of the input ConnectionBehaviour
 */
class InputBehaviour implements ConnectionBehaviour {

	private smoothedAccelX = 0;
	private smoothedAccelY = 0;
	private smoothedAccelZ = 0;

	public isAssigned(): boolean {
		return get(state).isRecording;
	}

	onAssigned(microbitBluetooth: MicrobitBluetooth, name: string) {
	}

	onExpelled(manual?: boolean, bothDisconnected?: boolean): void {
		state.update((s) => {
			s.isConnected = false;
			s.offerReconnect = !manual;
			s.reconnectState = DeviceRequestStates.INPUT;
			return s;
		});
	}

	onCancelledBluetoothRequest(): void {
		state.update((s) => {
			s.requestDeviceWasCancelled = true;
			s.isConnected = false;
			return s;
		});
	}

	onDisconnected(): void {
		state.update((s) => {
			s.isConnected = false;
			s.offerReconnect = false;
			s.reconnectState = DeviceRequestStates.NONE;
			return s;
		});
	}

	onConnected(name: string): void {
		informUser(text("alert.micro.GATTserverInform"));
		informUser(text("alert.micro.microBitServiceInform"));
		informUser(text("alert.micro.gettingDataInform"));
		try {
			state.update((s) => {
				s.isConnected = true;
				s.isRequestingDevice = DeviceRequestStates.NONE;
				s.offerReconnect = false;
				return s;
			});
		} catch (e) {
			alertUser(text("popup.connectMB.alert.failToReadService"));
		}

		informUser(text("alert.micro.nowConnectedInform"));
	}

	accelerometerChange(x: number, y: number, z: number): void {
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
}

export default InputBehaviour;

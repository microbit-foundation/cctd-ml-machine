import type MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import { DeviceRequestStates, informUser, state } from "../stores/uiStore";
import { t } from "../../i18n";
import type ConnectionBehaviour from "./ConnectionBehaviour";
import { get } from "svelte/store";
import MBSpecs from "../microbit-interfacing/MBSpecs";

let text = get(t);
t.subscribe(t => text = t);

class OutputBehaviour implements ConnectionBehaviour {
	isAssigned(): boolean {
		return get(state).isOutputting;
	}

	onAssigned(microbitBluetooth: MicrobitBluetooth, name: string) {
		informUser(text("alert.output.GATTserverInform"));
		informUser(text("alert.output.microBitServiceInform"));
		informUser(text("alert.output.connectingToComponents"));

		state.update((s) => {
			s.isOutputting = true;
			s.isRequestingDevice = DeviceRequestStates.NONE;
			s.offerReconnect = false;
			return s;
		});
		informUser(text("alert.output.nowConnectedInform"));
	}

	onExpelled(manual?: boolean, bothDisconnected?: boolean): void {
		// Ensure state is updated
		state.update((s) => {
			s.isOutputting = false;
			s.offerReconnect = !manual;
			if (!bothDisconnected) {
				s.reconnectState = DeviceRequestStates.OUTPUT;
			}
			return s;
		});
	}

	onCancelledBluetoothRequest(error?: Error): void {
		if (error) {
			if (error.message) {
				if (error.message.includes("User cancelled the requestDevice() chooser")) {
					// User just cancelled
					state.update((s) => {
						s.requestDeviceWasCancelled = true;
						return s;
					});
				}
			}
			console.log(error);
		}
		state.update((s) => {
			s.isOutputting = false;
			return s;
		});
	}

	accelerometerChange(x: number, y: number, z: number): void {
		return;
	}

	buttonChange(buttonState: MBSpecs.ButtonState, button: MBSpecs.Button): void {
		return;
	}

	onConnected(name: string): void {
		throw new Error("Not implemented")
	}

	onDisconnected(): void {
		throw new Error("Not implemented")
	}
}

export default OutputBehaviour;
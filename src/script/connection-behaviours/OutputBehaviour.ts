import type MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import { DeviceRequestStates, informUser, state } from "../stores/uiStore";
import { t } from "../../i18n";
import { get } from "svelte/store";
import MBSpecs from "../microbit-interfacing/MBSpecs";
import LoggingDecorator from "./LoggingDecorator";

let text = get(t);
t.subscribe(t => text = t);

class OutputBehaviour extends LoggingDecorator {
	private reconnectTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {/*empty*/},0);
	private timeout = 4000;

	onReady() {
		super.onReady();
		clearTimeout(this.reconnectTimeout)
		console.log("timeout cleared")
	}

	onAssigned(microbitBluetooth: MicrobitBluetooth, name: string) {
		super.onAssigned(microbitBluetooth, name)
		informUser(text("alert.output.GATTserverInform"));
		informUser(text("alert.output.microBitServiceInform"));
		informUser(text("alert.output.connectingToComponents"));

		state.update((s) => {
			s.isOutputting = true;
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
		informUser(text("alert.output.nowConnectedInform"));
	}

	onExpelled(manual?: boolean, bothDisconnected?: boolean): void {
		super.onExpelled(manual, bothDisconnected)
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

	onCancelledBluetoothRequest(): void {
		super.onCancelledBluetoothRequest()
		state.update((s) => {
			s.isOutputting = false;
			s.requestDeviceWasCancelled = true;
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
		super.onConnected(name)
		throw new Error("Not implemented")
	}

	onDisconnected(): void {
		super.onDisconnected()
		throw new Error("Not implemented")
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

export default OutputBehaviour;
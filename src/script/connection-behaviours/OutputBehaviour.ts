import type MicrobitBluetooth from "../microbit-interfacing/MicrobitBluetooth";
import { DeviceRequestStates, informUser, state } from "../stores/uiStore";
import { t } from "../../i18n";
import { get } from "svelte/store";
import MBSpecs from "../microbit-interfacing/MBSpecs";
import LoggingDecorator from "./LoggingDecorator";
import CookieManager from "../CookieManager";

let text = get(t);
t.subscribe(t => text = t);

class OutputBehaviour extends LoggingDecorator {
	private reconnectTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {/*empty*/},0);
	private timeout = 4000;

	onReady() {
		super.onReady();
		state.update(s => {
			s.isOutputting = true;
			return s;
		})
		clearTimeout(this.reconnectTimeout)
	}

	onAssigned(microbitBluetooth: MicrobitBluetooth, name: string) {
		super.onAssigned(microbitBluetooth, name)
		state.update(s => {
			s.isOutputAssigned = true;
			return s;
		})
	}

	onExpelled(manual?: boolean, bothDisconnected?: boolean): void {
		super.onExpelled(manual, bothDisconnected)
		state.update((s) => {
			s.isOutputting = false;
			s.offerReconnect = !manual;
			s.isOutputAssigned = false;
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
		informUser(text("alert.output.GATTserverInform"));
		informUser(text("alert.output.microBitServiceInform"));
		informUser(text("alert.output.connectingToComponents"));

		state.update((s) => {
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

	onDisconnected(): void {
		super.onDisconnected()
		// Ensure state is updated
		state.update((s) => {
			s.isOutputting = false;
			return s;
		});
	}

	/**
	 * Workaround for an unrecoverable reconnect failure due to a bug in chrome/chromium
	 * Refresh the page is the only known solution
	 * @private
	 */
	private onCatastrophicError() {
		// Set flag to offer reconnect when page reloads
		CookieManager.setReconnectFlag();
		location.reload();
	}
}

export default OutputBehaviour;
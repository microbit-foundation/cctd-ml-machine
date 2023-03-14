<script lang="ts">
	import StandardDialog from "../dialogs/StandardDialog.svelte";
	import BluetoothConnectDialog from "./bluetooth/BluetoothConnectDialog.svelte";
	import StartDialog from "./StartDialog.svelte";
	import DoneDownloadingDialog from "./usb/DoneDownloadingDialog.svelte";
	import DownloadingDialog from "./usb/DownloadingDialog.svelte";
	import FindUsbDialog from "./usb/FindUsbDialog.svelte";
	import ManualInstallTutorial from "./usb/manual/ManualInstallTutorial.svelte";
	import { DeviceRequestStates, state } from "../../script/stores/uiStore";
	import ConnectSameDialog from "./ConnectSameDialog.svelte";
	import Microbits from "../../script/microbit-interfacing/Microbits";
	import { btPatternInput, btPatternOutput } from "../../script/stores/connectionStore";
	import MBSpecs from "../../script/microbit-interfacing/MBSpecs";


	enum ConnectionStates {
		NONE, // No connection in progress -> Dialog box closed
		START, // Initial box with choice between usb installation and bluetooth connection
		START_OUTPUT, // Initial box if input microbit is already connected. Choice between same and other microbit for output
		BLUETOOTH, // Main bluetooth connect prompt, with pattern drawing
		USB_START, // Initial usb installation prompt
		USB_DOWNLOADING, // Downloading usb program status bar prompt
		USB_DONE, // Installation done prompt
		MANUAL_TUTORIAL // Prompt with tutorial gif for manual installation (and downloading of program)
	}

	export function startConnectionProcess(): void {
		currentState = $state.isInputConnected ? ConnectionStates.START_OUTPUT : ConnectionStates.START;
		deviceState = $state.isInputConnected ? DeviceRequestStates.OUTPUT : DeviceRequestStates.INPUT;
	}

	let currentState: ConnectionStates = ConnectionStates.NONE; // the current stage in the connection
	let deviceState: DeviceRequestStates = DeviceRequestStates.NONE; // TODO: Rename. This is 'simply' if its the first or second microbit to be connected
	let selectedMicrobitVersion: 1 | 2; // Used exclusively if manual program installation is required

	let flashProgress = 0;

	function onFoundUsbDevice() {
		Microbits.getLinkedFriendlyName().then(friendlyName => {// Find the name of the micro:bit
			if (deviceState === DeviceRequestStates.OUTPUT) {
				btPatternOutput.set(MBSpecs.Utility.nameToPattern(friendlyName));
			} else {
				btPatternInput.set(MBSpecs.Utility.nameToPattern(friendlyName));
			}

			Microbits.flashHexToLinked(progress => {// Flash hex
				// Send users to download screen
				if (currentState != ConnectionStates.USB_DOWNLOADING) {
					currentState = ConnectionStates.USB_DOWNLOADING;
				}
				flashProgress = progress;
			}).then(() => {// Finished flashing successfully
				currentState = ConnectionStates.USB_DONE;
			}).catch(() => {// Error during flashing process
				currentState = ConnectionStates.MANUAL_TUTORIAL;
			});
		}).catch(() => { // Couldn't find name. Set to manual transfer progress instead
			currentState = ConnectionStates.MANUAL_TUTORIAL;
		});
	}

	function onManualTransferSelectVersion(version: 1 | 2) {
		selectedMicrobitVersion = version;
		currentState = ConnectionStates.MANUAL_TUTORIAL;
	}

	function connectSame() {
		Microbits.useInputAsOutput();
		currentState = ConnectionStates.NONE;
	}
</script>

<main>
	<StandardDialog
		isOpen={currentState !== ConnectionStates.NONE}
		onClose={() => currentState = ConnectionStates.NONE}
	>

		{#if currentState === ConnectionStates.START}
			<StartDialog
				onStartBluetoothClick={() => currentState = ConnectionStates.BLUETOOTH}
				onStartUsbClick={() => currentState = ConnectionStates.USB_START}
			/>

		{:else if currentState === ConnectionStates.START_OUTPUT}
			<ConnectSameDialog
				onConnectSameClick={connectSame}
				onConnectDifferentClick={() => currentState = ConnectionStates.START}
			/>

		{:else if currentState === ConnectionStates.BLUETOOTH}
			<BluetoothConnectDialog
				onBluetoothConnected={() => {currentState = ConnectionStates.NONE}}
				deviceState={deviceState}
			/>

		{:else if currentState === ConnectionStates.USB_START}
			<FindUsbDialog
				onFoundUsb={onFoundUsbDevice}
			/>

		{:else if currentState === ConnectionStates.USB_DOWNLOADING}
			<DownloadingDialog transferProgress={flashProgress} />

		{:else if currentState === ConnectionStates.USB_DONE}
			<DoneDownloadingDialog
				onConnectBluetoothClick={() => currentState = ConnectionStates.BLUETOOTH }
			/>

		{:else if currentState === ConnectionStates.MANUAL_TUTORIAL}
			<ManualInstallTutorial
				onConnectBluetoothClick={() => currentState = ConnectionStates.BLUETOOTH}
			/>
		{/if}

	</StandardDialog>

</main>
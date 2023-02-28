<script lang="ts">
	import { state } from "../../script/stores/uiStore";
	import LiveGraph from "../graphs/LiveGraph.svelte";
	import { t } from "../../i18n";
	import MainConnectDialog from "../connection-prompt/ConnectDialogContainer.svelte";
	import TextInformation from "../information/TextInformation.svelte";
	import Microbits from "../../script/microbit-interfacing/Microbits";
	import StandardButton from "../StandardButton.svelte";

	let componentWidth: number;
	let connectDialogReference: MainConnectDialog;

	const connectButtonClicked = () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		connectDialogReference.startConnectionProcess();
	};

	const inputDisconnectButtonClicked = () => {
		Microbits.disconnectBluetoothInputAndOutput();
	};

	const outputDisconnectButtonClicked = () => {
		Microbits.disconnectBluetoothOutput();
	};

</script>

<!-- TODO: Reafactor and/or split up. Too long and nested component -->
<div
	bind:clientWidth={componentWidth}
	class="h-full w-full bg-white border-t border-solid border-black border-opacity-60 shadow-black shadow-xl"
>
	<MainConnectDialog
		bind:this={connectDialogReference}
	/>
	{#if !$state.isConnected}
		<div class="h-full w-full flex justify-center bg-white">
			<StandardButton
				onClick={connectButtonClicked}
				text={$t("footer.connectButtonNotConnected")}
			/>
		</div>
	{:else}
		<div class="relative w-full h-full">
			<div class="absolute w-full h-full">
				<LiveGraph width={componentWidth} />
			</div>
			<div class="w-full h-full p-0 m-0 absolute top-0 left-0">
				<div class="float-left mt-2 ml-2">
					<div class="float-left">
						<TextInformation
							titleText={$t("footer.helpHeader")}
							bodyText={$t("footer.helpContent")}
							isLightTheme={false}
							boxOffset={{x: 25, y: -50}}
						/>
					</div>
					<p class="float-left ml-10">Live</p>
					<p class="float-left ml-1 -mt-3 text-red-500 text-3xl">&#x2022;</p>
				</div>
				<div class="absolute right-2 top-2 m-0 float-right flex">

					{#if ($state.isPredicting || $state.isTraining) || $state.isOutputting}
						{#if $state.isOutputting}
							<StandardButton
								onClick={outputDisconnectButtonClicked}
								color="red"
								text={$t("menu.model.disconnect")}
							/>
						{:else}
							<StandardButton
								onClick={connectButtonClicked}
								text={$t("menu.model.connectOutputButton")}
							/>
						{/if}
					{/if}
					<div class="ml-2">
						<StandardButton
							onClick={inputDisconnectButtonClicked}
							color="red"
							text={$t("footer.disconnectButton")}
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	import Gesture from "../components/Gesture.svelte";
	import { state } from "../script/stores/uiStore";
	import { gestures } from "../script/stores/mlStore";
	import { t } from "../i18n";
	import InformationBase from "../components/information/InformationBase.svelte";
	import TextInformation from "../components/information/TextInformation.svelte";
	import RecordInformationContent from "../components/information/RecordInformationContent.svelte";
	import StandardDialog from "../components/dialogs/StandardDialog.svelte";
	import MainConnectDialog from "../components/connection-prompt/ConnectDialogContainer.svelte";
	import NewGestureButton from "../components/NewGestureButton.svelte";
	import StandardButton from "../components/StandardButton.svelte";
	import {startConnectionProcess} from "../script/stores/connectDialogStore";
    import ControlBar from "../components/control-bar/ControlBar.svelte";
	import TypingUtils from "../script/TypingUtils";
	import ExpandableControlBarMenu from "../components/control-bar/control-bar-items/ExpandableControlBarMenu.svelte";

  let isConnectionDialogOpen = false;

  $: hasSomeData = (): boolean => {
    if ($gestures.length === 0) {
      return false;
    }
    return $gestures.some(gesture => gesture.recordings.length > 0);
  };

  let connectDialogReference: MainConnectDialog;
</script>

<!-- Main pane -->
<main class="h-full flex flex-col">
	<div>
	<ControlBar>
		<ExpandableControlBarMenu>
			<p>test</p>
		</ExpandableControlBarMenu>
	</ControlBar>
	</div>
	{#if !hasSomeData() && !$state.isInputConnected}
		<!-- 'training page has same component. Extract' -->
		<div class="flex flex-col flex-grow justify-center">
			<div class="w-full text-primarytext">
				<p class="text-center text-3xl bold m-auto">
					{$t("menu.trainer.notConnected1")}
				</p>
				<p class="text-center text-3xl  bold m-auto">
					{$t("menu.trainer.notConnected2")}
				</p>
				<div class="text-center ml-auto mr-auto mb-2 mt-10 ">
					<img
						class="m-auto arrow-filter-color"
						src="imgs/down_arrow.svg"
						alt="down arrow icon"
						width="100px"
					/>
				</div>
			</div>
		</div>
	{:else}
		<div class="mt-4 ml-3">
			<StandardDialog
				isOpen={isConnectionDialogOpen}
				onClose={() => isConnectionDialogOpen = false} >
				<div class="w-70 text-center">
					<p class="mb-5">
						{$t("content.data.addDataNoConnection")}
					</p>
					<StandardButton
						onClick={() => {
							isConnectionDialogOpen = false;
							startConnectionProcess()
						}}
					>{$t("footer.connectButtonNotConnected")}</StandardButton>
				</div>
			</StandardDialog>
			<MainConnectDialog
				bind:this={connectDialogReference} />

			{#if $gestures.length > 0}
				<div class=" p-0 relative flex h-7">
					<div class="absolute left-3 flex">
						<TextInformation
							isLightTheme={false}
							iconText={$t("content.data.classification")}
							titleText={$t("content.data.classHelpHeader")}
							bodyText={$t("content.data.classHelpBody")} />
					</div>
					<div class="absolute left-55 flex">f
						<InformationBase
								isLightTheme={false}
								text={$t("content.data.choice")}>
							<RecordInformationContent isLightTheme={false} />
						</InformationBase>
					</div>
					{#if hasSomeData()}
						<div class="absolute left-92 flex">
							<TextInformation
								isLightTheme={false}
								iconText={$t("content.data.data")}
								titleText={$t("content.data.data")}
								bodyText={$t("content.data.dataDescription")} />
						</div>
					{/if}
				</div>
			{:else}
				<div class="flex justify-center">
					<div class="text-center text-xl w-1/2 text-bold text-primarytext">
						<p>{$t("content.data.noData")}</p>
					</div>
				</div>
			{/if}
			<!-- Display all gestures -->
			{#each $gestures as gesture (gesture.ID)}
				<Gesture
					bind:gesture
					onNoMicrobitSelect={() => isConnectionDialogOpen = true}
				/>
			{/each}
			<NewGestureButton />
		</div>
	{/if}
</main>

<style>
	.arrow-filter-color {
		filter: invert(100%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(100%)
		contrast(100%);
	}
</style>
<script lang="ts">
  import { hasSufficientData, state } from "../../script/stores/uiStore";
  import { TrainingStatus, trainingStatus } from "../../script/stores/mlStore";
  import { t } from "../../i18n";
  import StandardDialog from "../../components/dialogs/StandardDialog.svelte";
  import { slide } from "svelte/transition";
  import TrainingButton from "./TrainingButton.svelte";

  const sufficientData = hasSufficientData();

	let isFailedTrainingDialogOpen = false;

	$ : {
		if ($trainingStatus === TrainingStatus.Failure) {
			isFailedTrainingDialogOpen = true;
			trainingStatus.update(() => TrainingStatus.Untrained);
		}
	}


</script>

<StandardDialog
	isOpen={isFailedTrainingDialogOpen}
	onClose={() => isFailedTrainingDialogOpen = false}
>
	<div
		class="justify-center items-center content-center w-150 bg-white m-auto"
		transition:slide
	>
		<div>
			<p class="text-red-500 font-bold text-center text-xl mb-5">
				{$t("content.trainer.failure.header")}
			</p>
			<p class="mb-3">
				{$t("content.trainer.failure.body")}
			</p>
			<p class="font-bold">
				{$t("content.trainer.failure.todo")}
			</p>
		</div>
	</div>

</StandardDialog>
<div class="w-full h-full grid grid-cols-1 items-center place-items-center text-center">

	{#if !$state.isInputConnected}
		<div class="w-full">
			<p class="w-4/5 text-white text-3xl bold m-auto">
				{$t("menu.trainer.notConnected1")}
			</p>
			<p class="w-4/5 text-white text-3xl  bold m-auto">
				{$t("menu.trainer.notConnected2")}
			</p>
			<div class="text-center ml-auto mr-auto mb-2 mt-10 ">
				<img
					class="m-auto"
					src="imgs/down_arrow.svg"
					alt="down arrow icon"
					width="100px"
				/>
			</div>
		</div>
	{:else if !sufficientData}
		<div class="w-full">
			<h1 class="w-3/4 text-white text-3xl bold m-auto">
				{$t("menu.trainer.notEnoughDataHeader1")}
			</h1>
			<p class="w-3/5 text-white text-xl m-auto mt-5">
				{$t("menu.trainer.notEnoughDataInfoBody")}
			</p>
		</div>
	{:else if $state.isTraining}
		<div class="w-3/4 text-white">
			<div class="ml-auto mr-auto flex center-items justify-center">
				<i class="fa fa-solid fa-circle-notch  text-5xl animate-spin animate-duration-[2s]" />
			</div>
			<p class="text-white bold text-3xl bold mt-10">
				{$t("menu.trainer.isTrainingModelButton")}
			</p>
		</div>
	{:else}
		<div class="w-3/4 text-white">
			{#if $state.isPredicting}
				<p class="text-white bold text-3xl bold mt-10">
					{$t("menu.trainer.TrainingFinished")}
				</p>
				<p class="text-white bold text-xl bold mt-10">
					{$t("menu.trainer.TrainingFinished.body")}
				</p>
			{/if}
			<div class="w-full pt-5 text-white">
				<TrainingButton />
			</div>
		</div>
	{/if}

</div>

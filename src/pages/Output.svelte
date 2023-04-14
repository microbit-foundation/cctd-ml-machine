<script lang="ts">
	import OutputGesture from "../components/OutputGesture.svelte";
	import {
		buttonPressed,
		informUser,
		isReady,
		state,
	} from "../script/stores/uiStore";
	import { gestures, settings } from "../script/stores/mlStore";
	import { get } from "svelte/store";
	import { onMount } from "svelte";
	import { classify } from "../script/ml";
	import { t } from "../i18n";
	import TextInformation from "../components/information/TextInformation.svelte";
	import { fade } from "svelte/transition";
	import ControlBar from "../components/control-bar/ControlBar.svelte";

	// In case of manual classification, variables for evaluation
	let recordingTime = 0;
	// let lastRecording;

	// Bool flags to know whether output microbit popup should be show
	let hasClosedPopup = false
	let hasInteracted = false

	function onUserInteraction(): void{
		hasInteracted = true
	}

	/**
	 * Classify based on button click
	 */
	// method for recording gesture for that specific gesture
	function classifyClicked() {
		if (!isReady()) return;

		$state.isRecording = true;
		// lastRecording = undefined;
		informUser("Optager");

		// Get duration
		const duration = get(settings).duration;

		// Loading interval
		const loadingInterval = setInterval(() => {
			recordingTime++;
		}, duration / 30);

		// TODO: Clean this up to avoid 'firstMount' hack
		// Once duration is over (1000ms default), stop recording
		setTimeout(() => {
			clearInterval(loadingInterval);
			// lastRecording = getPrevData();
			$state.isRecording = false;
			recordingTime = 0;
			classify();
		}, duration);
	}

	// When microbit buttons are pressed, this is called
	// Assess whether settings match with button-clicked.
	// If so, the gesture calls the recording function.
	function triggerButtonsClicked(buttons: { buttonA: 0 | 1; buttonB: 0 | 1; }) {
		if (firstMount) {
			return;
		}

		let shouldClassify: boolean = !get(settings).automaticClassification &&
			(buttons.buttonA === 1 || buttons.buttonB === 1)

		if ( shouldClassify ){
			classifyClicked();
		}
	}

	// Hack to avoid classifying when visiting the webpage
	let firstMount = true;
	onMount(() => {
		firstMount = false;
	});

	$: triggerButtonsClicked($buttonPressed);
</script>


<!-- Main pane -->
<main class="h-full flex flex-col">
	<div>
		<ControlBar></ControlBar>
	</div>
	<div>
		{#if $state.isPredicting}
			<div class="relative flex h-8 mt-4">
				<div class="absolute left-5 flex">
					<TextInformation
						iconText={$t("content.model.output.prediction.iconTitle")}
						titleText={$t("content.model.output.prediction.descriptionTitle")}
						bodyText={$t("content.model.output.prediction.descriptionBody")}
					/>

				</div>
				<div class="absolute left-69 flex">
					<TextInformation
						iconText={$t("content.model.output.ledOutput.descriptionTitle")}
						titleText={$t("content.model.output.ledOutput.descriptionTitle")}
						bodyText={$t("content.model.output.ledOutput.descriptionBody")}
					/>

				</div>
				<div class="absolute left-122 flex">
					<TextInformation
						iconText={$t("content.model.output.sound.iconTitle")}
						titleText={$t("content.model.output.sound.descriptionTitle")}
						bodyText={$t("content.model.output.sound.descriptionBody")}
					/>
				</div>
			</div>

			<div class="pl-2">
				<!-- Display all gestures and their output capabilities -->
				{#each $gestures as gesture}
					<OutputGesture
						gesture={gesture}
						onUserInteraction={onUserInteraction}
					/>
				{/each}
			</div>
			{#if !$state.isOutputConnected && !hasClosedPopup && hasInteracted}
				<div transition:fade class="grid grid-cols-5 absolute bottom-5 w-full min-w-729px">
					<div
						class=" flex relative col-start-2 rounded-lg col-end-5 h-35"
						style="background-color:rgba(231, 229, 228, 0.85)">
						<div class="m-4 mr-2 w-3/4">
							<p class="text-2xl font-bold">
								{$t("content.model.output.popup.header")}
							</p>
							<p >
								{$t("content.model.output.popup.body")}
							</p>
						</div>
						<div class="text-center ml-0 mb-2 mt-8">
							<img
							class="m-auto arrow-filter-color"
							src="imgs/down_arrow.svg"
							alt="down arrow icon"
							width="80px"
							/>
						</div>
						<div class="absolute right-2 top-2 svelte-1rnkjvh">
							<button
								class="hover:bg-gray-100 rounded outline-transparent w-8 svelte-1rnkjvh"
								on:click={() => {hasClosedPopup = true}}
								>
								<i
									class="fas fa-plus text-lg text-gray-600 hover:text-gray-800 duration-75 svelte-1rnkjvh"
									style="transform: rotate(45deg);"
								/>
							</button>
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<div class="w-full h-full grid grid-cols-1 items-center place-items-center text-center">
				<p class='w-3/4 text-primarytext text-3xl bold'>
					{$t("content.model.trainModelFirstHeading")}
					<br>
					{$t("content.model.trainModelFirstBody")}
				</p>
			</div>
		{/if}
	</div>
</main>

<style>
	.arrow-filter-color {
		filter: invert(100%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%);
	}
</style>

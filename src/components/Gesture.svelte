<script lang="ts">

	import { get } from "svelte/store";
	import { alertUser, buttonPressed, informUser, isReady, state } from "../script/stores/uiStore";
	import {
		addRecording,
		chosenGesture,
		type GestureData,
		livedata,
		type RecordingData,
		removeGesture,
		removeRecording,
		settings
	} from "../script/stores/mlStore";

	import Recording from "./Recording.svelte";
	import { t } from "../i18n";
	import StandardButton from "./StandardButton.svelte";
	import ImageSkeleton from "./skeletonloading/ImageSkeleton.svelte";

	// Variables for component
	export let onNoMicrobitSelect: () => void;
	export let gesture: GestureData;

	const defaultNewName = $t("content.data.classPlaceholderNewClass");
	const recordingDuration = get(settings).duration;

	let isThisRecording = false;

	// When title is clicked. Remove name
	function titleClicked(): void {
		if (gesture.name === defaultNewName) {
			gesture.name = "";
		}
	}

	function removeClicked(): void {
		if (!isReady(false)) {
			return;
		}

		if (!window.confirm($t("alert.deleteGestureConfirm") + "\"" + gesture.name + "\"?")) {
			return;
		}
		$state.isPredicting = false;

		setTimeout(() => {
			removeGesture(gesture);
		}, 450);
	}

	// method for recording data point for that specific gesture
	function recordClicked(): void {
		if (!isReady()) {
			return;
		}

		$state.isRecording = true;
		informUser("Optager");
		isThisRecording = true;

		// New array for data
		let newData: { x: number[], y: number[], z: number[] } =
			{ x: [], y: [], z: [] };

		// Set timeout to allow recording in 1s
		const unsubscribe = livedata.subscribe((data) => {
			newData.x.push(data.accelX);
			newData.y.push(data.accelY);
			newData.z.push(data.accelZ);
		});

		// Once duration is over (1000ms default), stop recording
		setTimeout(() => {
			$state.isRecording = false;
			isThisRecording = false;
			unsubscribe();
			if (get(settings).minSamples <= newData.x.length) {
				const recording = { ID: Date.now(), data: newData } as RecordingData;
				addRecording(gesture.ID, recording);
				informUser("Færdiggjort optagelse"); // TODO: Translations
			} else {
				alertUser("Micro:Bit frakoblede under optagelse"); // TODO: Translations
			}
		}, recordingDuration);
	}

	// Delete recording from recordings array
	function deleteRecording(recording: RecordingData) {
		if (!isReady(false)) {
			return;
		}
		$state.isPredicting = false;
		removeRecording(gesture.ID, recording.ID);
	}

	// Selecting this gesture for recording. Updates settings accordingly
	// If gesture is already selected, the selection is removed.
	// If bluetooth is not connected, open connection prompt by calling callback
	function selectClicked(): void {
		if (!$state.isConnected) {
			chosenGesture.update((gesture) => {
				gesture = null;
				return gesture;
			});
			onNoMicrobitSelect();
			return;
		}
		chosenGesture.update((storedGesture) => {
			if (storedGesture === gesture) {
				storedGesture = null;
			} else {
				storedGesture = gesture;
			}
			return storedGesture;
		});
	}

	// When microbit buttons are pressed, this is called
	// Assess whether settings match with button-clicked.
	// If so, the gesture calls the recording function.
	function triggerButtonsClicked(buttons: { buttonA: 0 | 1, buttonB: 0 | 1 }): void {
		const set = get(settings);
		if ($chosenGesture !== gesture) {
			return;
		}
		if (
			(set.preferableButton === "AB") ||
			(buttons.buttonA && set.preferableButton === "A") ||
			(set.preferableButton === "B" && buttons.buttonB)
		)
			recordClicked();
	}

	function onTitleKeypress(event: KeyboardEvent) {
		const maxTitleLength = 25; // todo: Add to a config store?

		// Check backspace, delete and enter before alerting user, because we don't want to pop a warning when
		// the user is at 25 characters, but is pressing enter.
		if (event.code === "Backspace" || event.code === "Delete") {
			return true;
		}
		if (event.code === "Enter") {
			event.preventDefault();
			if (event.target instanceof HTMLElement) {
				event.target.blur();
			}
			return true;
		}
		if (gesture.name.length >= maxTitleLength) {
			event.preventDefault();
			alertUser($t("alert.data.classNameLengthAlert"));
			return false;
		}
	}


	// Make function depend on buttonsPressed store.
	// TODO: Inelegant. Rewrite
	let declaring = true;
	$: {
		if (!declaring) {
			// Do not call when component is mounted
			triggerButtonsClicked($buttonPressed);
		} else {
			declaring = false;
		}
	}

</script>

<main class="flex-row flex">
	<!-- Recordingbar to show recording-progress -->

	<div class="bg-red-600 h-1.5 rounded-full absolute mt-123px ml-14px"
			 style={isThisRecording
			? "transition: " + /* TODO: Clean this up! : */ (recordingDuration/1000).toString() +"s linear; width: 97%;"
			: "width:0;"}>
	</div>

	<div class="items-center flex mb-1">
		<!-- Title of gesture-->
		<div class="grid grid-cols-5 place-items-center
								border border-solid border-gray-200
								mb-2 p-2 bg-white rounded-xl
								w-50 h-30 ml-2">
			<div class="w-40 col-start-2 col-end-5 text-center
									font-semibold transition ease
									rounded-xl border border-gray-300
									border-solid hover:bg-gray-100">
				<h3 bind:textContent={gesture.name}
						contenteditable
						on:click={titleClicked}
						on:keypress={onTitleKeypress} />
			</div>
			<button class="pl-3 col-start-5 place-self-start justify-self-end outline-none">
				<i class="far fa-times-circle fa-lg text-light-800 hover:text-black transition ease" on:click={removeClicked} />
			</button>
		</div>

		{#if $chosenGesture !== gesture}
			<div
				class="border text-center border-solid border-gray-200 mb-2 p-2 bg-white rounded-xl w-35 h-30 ml-2 mr-2 cursor-pointer"
				on:click={selectClicked}>
				<div class="w-full text-center">
					<i class="w-full h-full m-0 mt-4 p-2 fas fa-plus fa-2x text-black-500 transition ease " />
				</div>
				<p class="w-full text-center">
					{$t("content.data.addData")}
				</p>
			</div>
		{:else}
			<div
				class="border selected text-center border-solid border-gray-200 mb-2 p-2 bg-white shadow-xl rounded-xl w-35 h-30 ml-2 mr-2 cursor-pointer"
				on:click={selectClicked}>
				<div class="w-full text-center">
					<i class="w-full h-full m-0 mt-4 p-2 fas fa-check fa-2x text-[#63BFC2] transition ease " />
				</div>
				<StandardButton
					text={$t("content.data.record")}
					onClick={recordClicked}
					stopPropagation={true}
					small={true}
					outlined={true}
					fillOnHover={true}
				/>
				<!-- <p class="w-full text-center text-[#63BFC2]">
					{$t("content.data.selected")}
				</p>
				<div>
					meh
				</div> -->
			</div>
		{/if}

		<!-- Show recording for each recording -->
		{#if gesture.recordings.length > 0}
			<div
				class="flex border border-solid border-gray-200 mb-2 p-2 bg-white rounded-xl h-30">

				{#each gesture.recordings as recording (String(gesture.ID) + String(recording.ID))}
					<Recording
						{recording}
						onDelete={deleteRecording}
					/>
				{/each}
			</div>
		{:else if $chosenGesture === gesture}
			<div
				class="relative float-left text-left h-30 w-60 bg-white border rounded-xl justify-start flex gap-1 m-0 -mt-2">
				<div class="text-left float-left mt-auto mb-auto ml-3">
					<ImageSkeleton height={95}
												 width={140}
												 src="imgs/microbit_record_guide.svg"
												 alt="microbit recording guide" />
				</div>
				<p class=" text-center absolute w-60px right-23px top-30px">{$t("content.index.recordButtonDescription")}</p>
			</div>
		{/if}
	</div>
</main>

<style>

    .selected {
        filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.459));
    }

</style>


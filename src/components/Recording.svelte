<script lang="ts">
  import type { RecordingData } from "../script/stores/mlStore";
	import RecordingGraph from "./graphs/RecordingGraph.svelte";

	// get recording from mother prop
	export let recording: RecordingData;
	export let onDelete: (recording: RecordingData) => void


	let hide = false;

	// Method for propagating deletion of recording
	function deleteClicked() {
		if (hide) return;

		hide = true;
		setTimeout(() => {
			hide = false;
			onDelete(recording)
		}, 450);
	}
</script>

<main
	class="h-26 w-40 pr-3 pt-1 bg-white"
>
	<div class="relative">
		<div class="absolute h-26 w-40 transition ease
								{hide ? 'bg-white duration-500' : 'bg-transparent'}">
		</div>
	</div>
	<!-- Deleting button -->
	<div class="relative">
		<button class="absolute -left-2.8px -top-6px outline-none">
			<div class="relative">
				<i class="z-1 absolute fas fa-circle fa-lg text-white" />
				<i class="z-2 absolute far fa-times-circle fa-lg transition
									ease cursor-pointer text-light-800 hover:text-black"
					 on:click={deleteClicked} />
			</div>
		</button>
	</div>
	<!-- Graph for recording data -->
	<RecordingGraph data={recording.data} />
</main>

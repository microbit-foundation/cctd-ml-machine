<script lang="ts">
	import { t } from "../i18n";
	import FrontPageTopBar from "../components/top/FrontPageTopBar.svelte";
	import FrontPageContentTile from "../components/FrontPageContentTile.svelte";
	import DoItYourselfMachineLearningTile from "../components/content-tiles/DoItYourselfMachineLearningTile.svelte";
	import IntroVideoTile from "../components/content-tiles/IntroVideoTile.svelte";

	// Just add the content titles you wish to put on front page, in the order you wish them to be there
	const contentTiles = [
		DoItYourselfMachineLearningTile,
		IntroVideoTile,
	]

</script>
<main>
	<FrontPageTopBar />
	<div class="p-10 pb-2 pt-2  mt-3">
		<div class="grid-container grid-cols-2 min-w-800px">
			{#each contentTiles as contentTile}
				<FrontPageContentTile contentComponent={contentTile}/>
			{/each}
		</div>
	</div>
</main>

<style>
    .grid-container {
        display: grid;
        gap: 1rem 1rem;
        grid-template-areas:
            "a b"
            "a c";
    }
</style>

<script lang="ts">
	import FrontPageContentTile from "../components/FrontPageContentTile.svelte";
	import DoItYourselfMachineLearningTile from "./home-page-content-tiles/DoItYourselfMachineLearningTile.svelte";
	import IntroVideoTile from "./home-page-content-tiles/IntroVideoTile.svelte";
	import ControlBar from "../components/control-bar/ControlBar.svelte";
	import ContactUsControlBarButton
		from "../components/control-bar/control-bar-items/ContactUsControlBarButton.svelte";
	import SelectLanguageControlBarDropdown
		from "../components/control-bar/control-bar-items/SelectLanguageControlBarDropdown.svelte";
    import { t } from "../i18n";

	// Just add the content titles you wish to put on front page, in the order you wish them to be there
	const contentTiles = [
		DoItYourselfMachineLearningTile,
		IntroVideoTile,
	]

</script>
<main>
	<ControlBar>
		<div class="w-full">
			<div class="float-left">{$t("content.index.acknowledgement")}</div>
			<div class="float-right flex flex-row">
				<ContactUsControlBarButton/>
				<SelectLanguageControlBarDropdown/>
			</div>
		</div>
	</ControlBar>
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

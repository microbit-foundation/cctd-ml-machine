<script lang="ts">
	import { t } from "../i18n";
	import FronPageTopBar from "../components/top/FrontPageTopBar.svelte";
	import ImageSkeleton from "../components/skeletonloading/ImageSkeleton.svelte";
</script>
<main>
	<FronPageTopBar />
	<div
		class="p-10 pb-2 pt-2  mt-0"
	>
		<div class="grid-container grid-cols-2 min-w-800px">
			<div
				class="border-gray-200 border border-solid bg-white rounded-lg p-6 shadow-xl">
				<p class="text-lg mb-2 font-semibold">
					{$t("content.index.heading")}
				</p>
				<p>
					{$t("content.index.howBody")}
				</p>
				<div class="relative w-342px place-self-center flex justify-around gap-1 ml-auto mr-auto mt-6 mb-6">
					<div class="">
						<p class="absolute text-center w-60px left-5px top-12px">{$t("content.index.ledDescription")}</p>
						<div class="flex-col place-content-center drop-shadow-xl center-items content-center justify-items-center">
							<div>
								<ImageSkeleton alt="microbit guide" height={114} src="imgs/microbit_guide.svg" width={200} />
							</div>
						</div>
						<p class="absolute text-center w-60px right-0px top-30px">{$t("content.index.recordButtonDescription")}</p>
					</div>
				</div>
				<p>
					{$t("content.index.setupBody2")}
				</p>
			</div>

			<div
				class="border-gray-200 border border-solid bg-white rounded-lg p-6 pb-2 flex flex-col"
			>
				<p class="text-lg mb-2 font-semibold">
					{$t("content.index.videoHeading")}
				</p>
				<p>
					{$t("content.index.videoBody")} <a href="https://www.dr.dk/skole/ultrabit/udskoling/elevoevelse-med-bbc-microbit-skjulte-moenstre-i-data" target="_blank">Link</a>
				</p>
				<br>
				<img src="imgs/data-trainer-thumpnail.png" alt="gg">
			</div>
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

	a {
	color: blue;
	text-decoration: underline;
	}
</style>

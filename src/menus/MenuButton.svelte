<script lang="ts">
	import TextInformation from "../components/information/TextInformation.svelte";
	import { t } from "../i18n";

	export let title: string;
	export let helpTitle: string;
	export let helpDescription: string;
	export let onClickFunction: () => void;
	export let isExpanded: boolean;
</script>
<div>
	<div class="border
              bg-opacity-75 border-solid border-3 border-opacity-80 min-h-20
              text-secondarytext border-secondary
              select-none transition duration-300
              rounded-full bg-primary"
			 class:bg-[#63BFC2]={isExpanded}
			 class:bg-opacity-95={isExpanded}
			 class:cursor-pointer={!isExpanded}
			 class:hover:bg-border-opacity-30={!isExpanded}
			 class:hover:bg-opacity-95={!isExpanded}
			 class:rounded-3xl={isExpanded}
			 on:click={onClickFunction}>

		<!-- Title -->
		<div class="h-full mt-6.2 relative">
			<p class="text-lg font-medium text-center"
				 class:underline={isExpanded}>
				{$t(title)}
			</p>
			<div class="absolute top-3px right-12">
				<TextInformation
					bodyText={$t(helpDescription)}
					boxOffset={{x: -200, y: 30}}
					titleText={$t(helpTitle)}
					width={280}
				/>
			</div>
		</div>
		<slot></slot>
	</div>
</div>
<style>
    div {
        transition: max-height 0.3s ease;
    }
</style>

<script lang="ts">
	import { fly } from "svelte/transition";
	import CookieManager from "../../script/CookieManager";
	import { t, locale, locales } from "../../i18n";
	import StandardDialog from "../dialogs/StandardDialog.svelte";
	import { onMount } from "svelte";
  import BaseDialog from "../dialogs/BaseDialog.svelte";
  import CookieDescriptionOverlay from "./CookieDescriptionOverlay.svelte";
  import StandardButton from "../StandardButton.svelte";

	let isCookieDialogOpen: boolean;
	let isDescriptionDialogOpen = false

	const acceptClicked = () => {
		CookieManager.setComplianceChoices({
			necessary: true,
			analytics: true
		});
		isCookieDialogOpen = false;
	};

	const rejectClicked = () => {
		CookieManager.setComplianceChoices({
			necessary: true,
			analytics: false
		});
		isCookieDialogOpen = false;
	};

	onMount(() => {
		isCookieDialogOpen = !CookieManager.isComplianceSet();
	})

</script>

<BaseDialog
	isOpen={isCookieDialogOpen}
	onClose={() => { return }}
>
	<StandardDialog
		isOpen={isDescriptionDialogOpen}
		onClose={() => isDescriptionDialogOpen = false}
	>
		<CookieDescriptionOverlay />
	</StandardDialog>
	<div out:fly class="fixed bottom-0 w-full bg-white">
		<select class="absolute bg-white right-5 top-5 text-black ml-2 mr-2 pl-2 pr-2" bind:value={$locale}>
			{#each locales as l}
				<option value={l}>{l}</option>
			{/each}
		</select>
		<div class="ml-auto mr-auto mt-5">
			<p class="text-center font-bold text-red-400 text-2xl ml-auto mr-auto">{$t("cookies.banner.title")}</p>
		</div>
		<div class="flex w-full mb-5">
			<div class="flex w-8/10 flex-col">

				<div class="mr-20 ml-20 mt-auto mb-auto">
					<p class="font-bold text-xl mb-2">
						{$t("cookies.banner.subtitle")}
					</p>
					<p>
						{$t("cookies.banner.text.pleaseHelp")}
					</p>
					<p>
						{$t("cookies.banner.text.description")}
					</p>
					<div class="mb-2"></div>
					<p>
						{$t("cookies.banner.text.readMore")}
						<a href="/"
							class="text-[#63BFC2] font-bold"
							on:click={(e) => {
								// Fix this. Why does ts consider this 'any'?
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
								e.preventDefault(); 
								isDescriptionDialogOpen = true;
							}}
						>
							{$t("cookies.banner.text.readMore.here")}
						</a>
					</p>
					<div class="mb-2"></div>
				</div>
			</div>
			<div class="flex w-1/4 flex-row mr-4">
				<div class="flex-1 flex-col m-auto pl-4 pr-4">
					<StandardButton 
						text={$t("cookies.banner.buttons.accept")}
						color="blue"
						onClick={acceptClicked}
					/>
				</div>
				<div class="flex-1 flex-col m-auto pl-4 pr-4">
					<StandardButton 
						color="gray"
						text={$t("cookies.banner.buttons.reject")}
						onClick={rejectClicked}
					/>
				</div>
			</div>
		</div>
	</div>
</BaseDialog>

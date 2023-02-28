<!-- Left-hand side menu -->
<script lang="ts">
	import Menus from "../script/navigation/Menus";
	import Navigation from "../script/navigation/Navigation";
	import { Pages } from "../script/navigation/Pages";
	import { t } from "../i18n";
	import MenuButton from "../menus/MenuButton.svelte";
	import { get } from "svelte/store";
	import { state } from "../script/stores/uiStore";

	const goToHomePage = () => {
		Navigation.setCurrentPage(Pages.HOMEPAGE);
	};

	let expandedId = -1;
	Menus.getOpenMenuId().subscribe(value => {
		expandedId = value;
	});

	/** The following adds a preloader, and detects once image has loaded for the sidebar.
	 *  The result should be that once the image is loaded, it will be cached, and when fetched
	 *  by the bgElem, it should be significantly faster. My test resulted in 300ms for first fetch and 45ms for second.
	 *  Could be improved by utilising the <img> element instead. Then we could just use the onload event for that.*/
	const imageUrl = "imgs/sidebar_background.svg";
	let bgElem: HTMLElement;
	let bgImg = document.createElement("img");
	bgImg.src = imageUrl;
	bgImg.addEventListener("load", () => {
		bgElem.style.backgroundImage = "url('" + bgImg.src + "')";
		$state.isLoading = false;
	});
	bgImg.src = imageUrl;
</script>

<div
	bind:this={bgElem}
	class="relative flex flex-col w-full p-5 pl-5 pr-5 border-r border-solid border-black border-opacity-40 shadow-2xl">
	<div class="absolute bottom-15 -left-2">
		<img
			alt="decoration arrows"
			src="imgs/partial_red_arrows.svg"
			width="225px"
		/>
	</div>

	<p class="mb-8 text-white font-extrabold text-3xl">
		{$t("content.index.ultrabit")}
	</p>
	<div class="text-white absolute right-10 top-5 focus:outline-none">
		<button
			class="rounded hover:bg-white hover:bg-opacity-10 duration-100  select-none outline-none"
			on:click={goToHomePage}
		>
			<i class="fas fa-home text-3xl outline-none" />
		</button>
	</div>
	<div class="relative">
		{#each get(Menus.getMenuStore()) as menu, id}
			<MenuButton
				onClickFunction={() => {
					Navigation.setCurrentPage(menu.navigationPage)
				}}
				title={menu.title}
				helpTitle={menu.infoBubbleTitle}
				helpDescription={menu.infoBubbleContent}
				isExpanded={expandedId === id}>
				<svelte:component
					this={expandedId === id ? menu.expandedButtonContent : menu.collapsedButtonContent} />
			</MenuButton>
			{#if id !== get(Menus.getMenuStore()).length - 1}
				<div class="text-center ml-auto mr-auto mb-1 mt-1">
					<img
						class="m-auto"
						src="imgs/down_arrow.svg"
						alt="down arrow icon"
						width="30px"
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>
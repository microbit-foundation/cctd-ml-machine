<!-- Left-hand side menu -->
<script lang="ts">
	import Menus from "../script/navigation/Menus";
	import Navigation from "../script/navigation/Navigation";
	import { Pages } from "../script/navigation/Pages";
	import MenuButton from "../menus/MenuButton.svelte";
	import { get } from "svelte/store";

	const goToHomePage = () => {
		Navigation.setCurrentPage(Pages.HOMEPAGE);
	};

	let expandedId = -1;
	Menus.getOpenMenuId().subscribe(value => {
		expandedId = value;
	});

</script>

<div class="bg-gradient-to-b from-primary to-secondary relative flex flex-col w-full p-5 pl-5 pr-5 border-r border-solid border-black border-opacity-40 shadow-2xl">
	<div class="absolute bottom-15 -left-2">
		<img
			alt="decoration arrows"
			src="imgs/partial_red_arrows.svg"
			width="225px"
		/>
	</div>

	<p class="mb-8 text-secondarytext font-extrabold text-3xl">
		{"ML-Machine"}
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
<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<!-- Left-hand side menu -->
<script lang="ts">
  import { get } from 'svelte/store';
  import type { MenuProperties } from '../../lib/navigation/Menus';
  import { currentPath, navigate, Paths } from '../../router/Router';
  import { state } from '../../lib/stores/Stores';
  import MediaQuery from './MediaQuery.svelte';
  import { Feature, getFeature } from '../../lib/FeatureToggles';
  import Menus from '../../lib/navigation/Menus';
  import MenuButton from '../menus/MenuButton.svelte';

  $: shouldBeExpanded = (menuProps: MenuProperties) => {
    let path = $currentPath;
    if (menuProps.navigationPath === path) {
      return true;
    }
    if (menuProps.additionalExpandPaths === undefined) {
      return false;
    }
    return menuProps.additionalExpandPaths.includes(path);
  };

  const onLoad = () => {
    $state.isLoading = false;
  };
</script>

<div
  class="bg-gradient-to-b from-primary to-secondary relative flex flex-col w-full shadow-2xl">
  <!-- flush top bar -->
  <div class="h-12 shadow-md w-full flex justify-center">
    <MediaQuery query="(max-width: 1500px)" let:matches={isSmall}>
      <p
        class="text-secondarytext font-extrabold self-center"
        class:text-3xl={!isSmall}
        class:text-2xl={isSmall}>
        {getFeature(Feature.TITLE)}
      </p>
      <div class="text-white self-center ml-4 focus:outline-none">
        <button
          class="rounded hover:bg-white
						   hover:bg-opacity-10 duration-100
						   select-none outline-none"
          on:click={() => navigate(Paths.HOME)}>
          <i class="fas fa-home text-2xl outline-none" />
        </button>
      </div>
    </MediaQuery>
  </div>

  <!-- Menu -->
  <div class="p-5 pl-5 pr-5">
    <div class="absolute bottom-15 -left-2">
      <img alt="decoration arrows" src="/imgs/partial_red_arrows.svg" width="225px" />
    </div>

    <div class="relative">
      {#each get(Menus.getMenuStore()) as menu, id}
        <MenuButton
          onClickFunction={() => {
            navigate(menu.navigationPath);
          }}
          title={menu.title}
          helpTitle={menu.infoBubbleTitle}
          helpDescription={menu.infoBubbleContent}
          isExpanded={shouldBeExpanded(menu)}>
          <svelte:component
            this={shouldBeExpanded(menu)
              ? menu.expandedButtonContent
              : menu.collapsedButtonContent} />
        </MenuButton>
        {#if id !== get(Menus.getMenuStore()).length - 1}
          <div class="text-center ml-auto mr-auto mb-1 mt-1">
            <img
              on:load={onLoad}
              class="m-auto"
              src="/imgs/down_arrow.svg"
              alt="down arrow icon"
              width="30px" />
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

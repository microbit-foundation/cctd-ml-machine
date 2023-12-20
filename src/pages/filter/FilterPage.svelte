<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import FilterToggler from './FilterToggler.svelte';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
  import { t } from '../../i18n';
  import { gestures } from '../../script/stores/Stores';
  import StandardButton from '../../components/StandardButton.svelte';
  import { Paths, navigate } from '../../router/paths';
  import FilterTypes, { FilterType } from '../../script/domain/FilterTypes';

  let isFilterInspectorDialogOpen = false;
  let currentFilter: FilterType | undefined = undefined;

  const openFilterInspector = (filter: FilterType, fullScreen: boolean) => {
    currentFilter = filter;
    isFilterInspectorDialogOpen = fullScreen;
  };

  const filtersAvailable = FilterTypes.toIterable();
</script>

<ControlBar>
  <StandardButton
    fillOnHover
    small
    outlined
    bold={false}
    shadows={false}
    color={'primary'}
    onClick={() => {
      navigate(Paths.TRAINING);
    }}>
    <i class="fas fa-solid fa-arrow-left" />
  </StandardButton>
</ControlBar>
{#if $gestures.length === 0}
  <div class="flex flex-col flex-grow justify-center items-center text-center">
    <div class="w-full text-primarytext">
      <h1 class="w-3/4 text-3xl bold m-auto">
        {$t('content.filters.NoDataHeader')}
      </h1>
      <p class="w-3/5 text-xl m-auto mt-5">
        {$t('content.filters.NoDataBody')}
      </p>
    </div>
  </div>
{:else if isFilterInspectorDialogOpen && currentFilter !== undefined}
  <div class="flex justify-center items-center mt-5">
    <FilterToggler filterType={currentFilter} {openFilterInspector} fullScreen={true} />
  </div>
{:else}
  <div class="flex flex-wrap">
    {#each filtersAvailable as filter}
      <FilterToggler filterType={filter} {openFilterInspector} />
    {/each}
  </div>
{/if}

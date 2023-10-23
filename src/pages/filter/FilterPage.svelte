<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import FilterToggler from './FilterToggler.svelte';
  import { FilterType, Filters } from '../../script/datafunctions';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';

  let isFilterInspectorDialogOpen = false;
  let currentFilter: FilterType | undefined = undefined;

  const openFilterInspector = (filter: FilterType, fullScreen: boolean) => {
    currentFilter = filter;
    isFilterInspectorDialogOpen = fullScreen;
  };

  const filter: FilterType = Object.values(Filters)[4];
</script>

<div>
  <ControlBar>
  </ControlBar>
  {#if isFilterInspectorDialogOpen && currentFilter !== undefined}
    <div class="flex justify-center items-center mt-5">
      <FilterToggler filter={currentFilter} {openFilterInspector} fullScreen={true} />
    </div>
  {:else}
  <div class="flex flex-wrap">
   {#each Object.values(Filters) as filter}
      <FilterToggler {filter} {openFilterInspector} />
   {/each}
  </div>
  {/if}
</div>

<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { getFilterTypes } from '../../core/filter/FilterUtils';
  import { anchorElement } from './FilterList';
  import FilterListRow from './FilterListRow.svelte';

  const availableFilters = getFilterTypes();
  let filterElement: HTMLElement;
  $: anchorElement.set(filterElement);
</script>

<div
  class="flex flex-col border-solid border-2 border-secondary rounded-md shadow-md w-50"
  bind:this={filterElement}>
  {#each availableFilters as filterType}
    <FilterListRow {filterType} />
  {/each}
</div>

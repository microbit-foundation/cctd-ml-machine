<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import FilterTypes from '../../script/domain/FilterTypes';
  import { anchorElement } from './FilterList';
  import FilterListRow from './FilterListRow.svelte';

  const availableFilters = FilterTypes.toIterable();
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

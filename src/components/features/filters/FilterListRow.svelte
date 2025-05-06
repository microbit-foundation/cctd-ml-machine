<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import type { FilterType } from '../../../lib/domain/FilterTypes';
  import FilterTypes from '../../../lib/domain/FilterTypes';
  import { stores } from '../../../lib/stores/Stores';
  import { navigate, Paths } from '../../../router/Router';
  import {
    highlightedFilter,
    showHighlighted,
    toggleFilterCheckmarkClickHandler,
  } from './FilterList';

  export let filterType: FilterType;
  const filter = FilterTypes.createFilter(filterType);
  const classifier = stores.getClassifier();
  const selectedFilters = classifier.getFilters();
  $: checked = $selectedFilters.map(f => f.getType()).includes(filterType);
</script>

{#key `filter-${filterType}-${checked}`}
  <div
    class="border-solid border-secondary border-b-1 last:border-b-0 bg-backgroundlight">
    <div class="flex flex-row py-2 px-1 justify-between">
      <div class="flex">
        <input
          type="checkbox"
          id={`filter-${filter.getName()}`}
          on:click={toggleFilterCheckmarkClickHandler(filterType)}
          {checked}
          class="w-5 h-5 self-center" />
        <label
          class="self-center ml-2 text-sm max-w-32 truncate whitespace-nowrap"
          for={`filter-${filter.getName()}`}>
          {filter.getName()}
        </label>
      </div>
      <div class="min-w-6">
        <img
          on:mouseenter={() => {
            highlightedFilter.set(filterType);
            showHighlighted.set(true);
          }}
          on:mouseleave={() => {
            showHighlighted.set(false);
          }}
          on:click={() => {
            navigate(Paths.FILTERS);
            showHighlighted.set(false);
            highlightedFilter.set(filterType);
          }}
          src="imgs/parallel.svg"
          alt="data representation icon"
          class="w-6 hover:opacity-60 mr-0.5 cursor-pointer" />
      </div>
    </div>
  </div>
{/key}

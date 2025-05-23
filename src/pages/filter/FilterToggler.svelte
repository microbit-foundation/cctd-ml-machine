<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import Information from '../../components/ui/information/Information.svelte';
  import { type Filter } from '../../lib/domain/Filter';
  import FilterTypes, { FilterType } from '../../lib/domain/FilterTypes';
  import { stores } from '../../lib/stores/Stores';
  import D3Plot from './D3Plot.svelte';

  const classifier = stores.getClassifier();

  export let filterType: FilterType;
  export let openFilterInspector: (filter: FilterType, fullScreen: boolean) => void;
  export let fullScreen = false;

  const width = () => (fullScreen ? '1100px' : '550px');
  const filter = FilterTypes.createFilter(filterType);
  const filterName = filter.getName();
  const filterDescription = filter.getDescription();

  const filters = classifier.getFilters();

  $: isActive = $filters
    .map((currentFilter: Filter) => currentFilter.getType())
    .includes(filterType);

  const toggleFilter = () => {
    if (filters.has(filterType)) {
      filters.remove(filterType);
    } else {
      filters.add(filterType);
    }
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="
      bg-white
      h-min
      duration-200
      overflow-hidden
      rounded-lg
      m-2
      relative
      {'w-' + width()}
      {isActive ? 'shadow-lg' : ''}">
  <div class="filter flex justify-between">
    <div class="flex flex-row relative">
      <div class="absolute">
        <Information
          bodyText={filterDescription}
          titleText={filterName}
          isLightTheme={false} />
      </div>
      <h2 class="mb-2 mr-1 mt-3 ml-8 line-through" class:line-through={false}>
        {filterName}
      </h2>
    </div>
    <!-- Buttons -->
    <div class="flex">
      <!-- maxumize button -->

      <div
        class="mr-2 mt-2 cursor-pointer"
        on:click|stopPropagation={() => {
          openFilterInspector(filterType, !fullScreen);
        }}>
        <i
          class="fa-lg transition ease {fullScreen
            ? 'fas fa-solid fa-compress hover:(transform scale-150)'
            : 'fas fa-solid fa-expand hover:(transform scale-150)'}" />
      </div>

      <!-- Disabling button -->
      <div
        class="mr-2 mt-2 cursor-pointer"
        on:click|stopPropagation={() => {
          toggleFilter();
        }}>
        <i
          class="fa-lg transition ease {isActive
            ? 'far fa-times-circle text-red-500 hover:(transform scale-150)'
            : 'fas fa-plus-circle text-lime-600 hover:(transform scale-150)'}" />
      </div>
    </div>
  </div>
  <div class="w-full h-min px-5 pb-4">
    <D3Plot {filterType} {fullScreen} />
  </div>
  <div
    class="
        absolute
        w-full
        h-full
        top-0
        left-0
        z-10
        bg-gray-100
        grey-shader
        bg-opacity-60
        pointer-events-none
        {isActive ? 'hidden' : 'block'}
      " />
</div>

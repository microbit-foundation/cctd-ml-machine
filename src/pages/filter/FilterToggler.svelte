<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import Information from '../../components/information/Information.svelte';
  import TypingUtils from '../../script/TypingUtils';
  import { FilterType, determineFilter } from '../../script/datafunctions';
  import { settings } from '../../script/stores/mlStore';
  import FilterGraph from './FilterGraph.svelte';

  export let filter: FilterType;

  const filterStrategy = determineFilter(filter);
  const filterText = filterStrategy.getText();

  $: isActive = $settings.includedFilters.has(filter);

  const toggleFilter = () => {
    // Should be introduced again before pushed to production branch
    // settings.update(s => {
    //   if (s.includedFilters.has(filter)) {
    //     s.includedFilters.delete(filter);
    //   } else {
    //     s.includedFilters.add(filter);
    //   }
    //   return s;
    // });
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
      {isActive ? 'shadow-lg' : ''}">
  <div class="filter flex justify-between">
    <div class="flex flex-row relative">
      <div class="absolute">
        <Information
          bodyText={filterText.description}
          titleText={filterText.name}
          isLightTheme={false} />
      </div>
      <h2 class="mb-2 mr-1 mt-3 ml-8 line-through" class:line-through={false}>
        {filterText.name}
      </h2>
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
  <div class="w-full h-min px-5 pb-4">
    <FilterGraph {filter} aspectRatio={1} />
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

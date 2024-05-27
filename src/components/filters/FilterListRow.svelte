<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import FilterTypes, { FilterType } from '../../script/domain/FilterTypes';
  import { stores } from '../../script/stores/Stores';
  import { toggleFilterCheckmarkClickHandler } from './FilterList';

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
        <label class="self-center ml-2 text-sm" for={`filter-${filter.getName()}`}>
          {filter.getName()}
        </label>
      </div>
      <div class="ml-3 border-l-2">
        <img
          on:mouseenter={() => {}}
          on:mouseleave={() => {}}
          src="imgs/ML_predict.svg"
          alt="data representation icon"
          class="w-6 hover:opacity-60 cursor-pointer" />
      </div>
    </div>
  </div>
{/key}

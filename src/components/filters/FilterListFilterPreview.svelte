<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import D3Plot from '../../pages/filter/D3Plot.svelte';
  import FilterTypes, { FilterType } from '../../script/domain/FilterTypes';
  import { highlightedFilter, anchorElement, showHighlighted } from './FilterList';

  $: top = $anchorElement?.getBoundingClientRect().top ?? 0;
  $: left = $anchorElement?.getBoundingClientRect().right ?? 0;
  $: filter = FilterTypes.createFilter($highlightedFilter);
  $: filterType = $highlightedFilter ?? FilterType.ACC;
</script>

{#if $showHighlighted}
  <div
    class="bg-white absolute p-2 z-2 rounded-md border-2 border-secondary"
    style={`top:${top}px; left:${left}px`}>
    <div class="max-w-[500px]">
      <p class="font-bold">{filter.getName()}</p>
      <p>{filter.getDescription()}</p>
    </div>
    <D3Plot {filterType} />
  </div>
{/if}

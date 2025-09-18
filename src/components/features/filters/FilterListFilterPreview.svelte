<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { FilterType } from '../../../core/entities/filter/Filter';
  import { createFilter } from '../../../core/entities/filter/FilterUtils';
  import D3Plot from '../../../pages/filter/D3Plot.svelte';
  import { highlightedFilter, anchorElement, showHighlighted } from './FilterList';

  $: top = $anchorElement?.getBoundingClientRect().top ?? 0;
  $: left = $anchorElement?.getBoundingClientRect().right ?? 0;
  $: filter = createFilter($highlightedFilter);
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

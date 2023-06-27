<script lang="ts">
  import FilterGraph from './FilterGraph.svelte';
  import { FilterType, Filters } from '../../script/datafunctions';

  const filters: FilterType[] = [];

  for (const filter of Object.values(Filters)) {
    // console.log(filter1, filter2);
    filters.push(filter); // Why are you so retarded typescript?
  }
  console.log('FILTERS:', filters);
</script>

<div>
  {#each filters as filter}
    <FilterGraph {filter} />
  {/each}
</div>

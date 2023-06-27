<script lang="ts">
  import FilterGraph from './FilterGraph.svelte';
  import { Filters } from '../../script/datafunctions';
</script>

<div class="p-5 grid grid-cols-2">
  {#each Object.values(Filters) as filter}
    <FilterGraph {filter} />
  {/each}
</div>

<script lang="ts">
  import FilterGraph from './FilterGraph.svelte';
  import { Filters } from '../../script/datafunctions';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
</script>

<div>
  <ControlBar />
  <div class="p-5 grid grid-cols-2">
    {#each Object.values(Filters) as filter}
      <FilterGraph {filter} />
    {/each}
  </div>
</div>

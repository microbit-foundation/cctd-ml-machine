<script lang="ts">
  import FilterTypes from '../../script/domain/FilterTypes';
  import FilterListRow from './FilterListRow.svelte';

  const availableFilters = FilterTypes.toIterable();
</script>

<div class="flex flex-col border-solid border-2 border-secondary rounded-md shadow-md">
  {#each availableFilters as filterType}
    <FilterListRow {filterType} />
  {/each}
</div>

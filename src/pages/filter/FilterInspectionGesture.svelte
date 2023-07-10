<script lang="ts">
  import RecordingGraph from '../../components/graphs/RecordingGraph.svelte';
  import { FilterType } from '../../script/datafunctions';
  import { GestureData } from '../../script/stores/mlStore';
  import FilterGraph from './FilterGraph.svelte';

  // Variables for component
  export let gesture: GestureData;
  export let filter: FilterType | undefined;
  export let color: string;
</script>

<div class="w-full min-w-200 mr-5 flex items-center relative">
  <p class="absolute rounded-t bg-white py-1 px-2 z-1 -top-1 ml-5 font-semibold">
    {gesture.name}
  </p>
  <div class="flex relative m-5 bg-white h-35 w-3/4 rounded overflow-x-auto">
    {#each gesture.recordings as recording}
      <div class="h-30 min-w-45 pr-3 pt-2 flex">
        <RecordingGraph data={recording.data} />
      </div>
    {/each}
  </div>
  <i class="text-black text-opacity-40 fas fa-long-arrow-alt-right fa-2x" />
  <div class="relative m-5 bg-white h-35 w-65 rounded">
    {#if filter !== undefined}
      <FilterGraph
        {filter}
        {gesture}
        forcedColor={color}
        displayLegend={false}
        aspectRatio={1.2}
        displayYTicks={false} />
    {/if}
  </div>
</div>

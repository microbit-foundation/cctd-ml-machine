<script lang="ts">
  import { Vector3 } from '../../components/3d-inspector/View3DUtility';
  import RecordingGraph from '../../components/graphs/RecordingGraph.svelte';
  import { FilterType } from '../../script/datafunctions';
  import { GestureData } from '../../script/stores/mlStore';
  import FilterGraph from './FilterGraph.svelte';

  // import FilterSum from "./FilterSum.svelte";
  // import Recording from "./FilterRecording.svelte";
  // import BoxGraph from "../../graphs/BoxGraph.svelte";
  // import type { Vector3 } from "./utility";
  // import { getColor } from "../../graphs/utility";

  // Variables for component
  export let gesture: GestureData;
  export let filter: FilterType | undefined;
  export let color: string;
  // export let name = "";
  // export let filteredRecordings: Vector3[] = [];
  // export let recordings = [];
  // export let i: number;
  // export let liveData: Vector3;
  export let limit = 4;

  // const data = {
  //   name: 'Deprecated',
  //   points: { x: [] as number[], y: [] as number[], z: [] as number[] },
  // };
  // const dataRep = [data];
  // filteredRecordings.forEach(r => {
  //   data.points.x.push(r.x);
  //   data.points.y.push(r.y);
  //   data.points.z.push(r.z);
  // });

  // function getColor(index: number): string {
  //   const colors = [
  //     '#f9808e',
  //     '#80f98e',
  //     '#808ef9',
  //     '#80dfff',
  //     '#df80ff',
  //     '#ffdf80',
  //     '#ff3333',
  //     '#33ff33',
  //     '#3333ff',
  //   ];
  //   return colors[index % colors.length];
  // }

  // const config = {
  //   options: {
  //     aspectRatio: 1.2,
  //     elements: {
  //       line: {
  //         borderWidth: 0,
  //       },
  //       point: {
  //         radius: 10,
  //         pointStyle: 'line',
  //         borderWidth: 1,
  //         borderColor: '#000000',
  //       },
  //     },
  //     interaction: {
  //       intersect: false,
  //     },
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         display: false,
  //       },
  //       title: {
  //         display: false,
  //       },
  //     },
  //     scales: {
  //       y: {
  //         type: 'linear',
  //         min: 1.2,
  //         max: 0,
  //         grid: {
  //           color: '#f3f3f3',
  //         },
  //         ticks: {
  //           display: false, //this will remove only the label
  //         },
  //       },
  //     },
  //   },
  // };
</script>

<div class="w-full min-w-200 mr-5 flex items-center relative">
  <p class="absolute rounded-t bg-white py-1 px-2 z-1 -top-1 ml-5 font-semibold">
    {gesture.name}
  </p>
  <div class="flex relative m-5 bg-white h-35 w-3/4 rounded overflow-x-auto">
    {#each gesture.recordings as recording}
      <div class="h-32 min-w-45 pr-3 pt-2 flex">
        <RecordingGraph data={recording.data} />
        <!-- <div class="h-25 w-4 grid grid-cols-3 gap-1 ml-1 mr-2 items-end">
          {#each ['x', 'y', 'z'] as group, color}
            <div
              class="{color === 0
                ? 'bg-red-200 '
                : color === 1
                ? 'bg-green-200 '
                : 'bg-blue-200 '}rounded-sm w-full"
              style="height: {0.5 * 72 + 17}%">
              <div
                class="w-1.5 h-1.5 -ml-0.33 -mt-0.5 rounded-1 {color === 0
                  ? 'bg-red-400 '
                  : color === 1
                  ? 'bg-green-400 '
                  : 'bg-blue-400 '}" />
            </div>
          {/each}
        </div> -->
      </div>
      <!-- <div>
        {'HERE' + recording.ID.toString()}
      </div> -->
    {/each}
    <!-- {gesture.name} -->
  </div>
  <i class="text-black text-opacity-40 fas fa-long-arrow-alt-right fa-2x" />
  <!-- <div class="relative m-5 bg-white h-35 w-1/8 rounded"> -->
  <!-- </div> -->
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

<!-- style="height: {filteredRecordings[i][group] * 72 + 17}%" -->

<!-- <div class="relative mb-8 h-29 w-full">
  <div class="absolute px-2 pt-1 -mt-4 bg-white rounded-t">
    <p class="font-semibold">{gesture.name}</p>
  </div>
  
  <div class="flex flex-row items-center justify-between max-w-full overflow-hidden">
    <div
      class="items-center flex border border-solid border-gray-200 p-2 bg-white rounded">
      {#each gesture.recordings.slice(0, limit) as recording, i}
        <RecordingGraph data={recording.data} />
        <div class="h-25 w-4 grid grid-cols-3 gap-1 -ml-3 mr-2 items-end">
          {#each ['x', 'y', 'z'] as group, color}
            <div
              class="{color === 0
                ? 'bg-red-200 '
                : color === 1
                ? 'bg-green-200 '
                : 'bg-blue-200 '}rounded-sm w-full"
              style="height: {0.5 * 72 + 17}%">
              <div
                class="w-1.5 h-1.5 -ml-0.33 -mt-0.5 rounded-1 {color === 0
                  ? 'bg-red-400 '
                  : color === 1
                  ? 'bg-green-400 '
                  : 'bg-blue-400 '}" />
            </div>
          {/each}
        </div>
      {/each}
      {#if gesture.recordings.length > limit}
        <p class="mr-4 ml-2 text-2xl font-thin">+{gesture.recordings.length - limit}</p>
      {/if}
    </div>

    <i class="text-black text-opacity-40 fas fa-long-arrow-alt-right fa-2x" />
    <div
      class="items-center flex border h-31 border-solid border-gray-200 p-2 bg-white rounded">
      <FilterSum filterData={filteredRecordings} />
      <div class="max-w-40 max-h-35 overflow-hidden">
        {#if filter !== undefined}
          <FilterGraph {filter} />
        {/if}
      </div>
    </div>
  </div>
</div> -->

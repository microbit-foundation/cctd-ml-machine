<script lang="ts">
  import Information from '../../components/information/Information.svelte';
  import { FilterType, Filters, determineFilter } from '../../script/datafunctions';
  import { gestures, settings } from '../../script/stores/mlStore';
  import BoxGraph from './BoxGraph.svelte';

  export let filter: FilterType;

  type FilteredData = {
    name: string;
    points: {
      x: number[];
      y: number[];
      z: number[];
    };
  };

  const filterStrategy = determineFilter(filter);
  const filterText = filterStrategy.getText();
  const filterFunction = (data: number[]) => filterStrategy.computeOutput(data);

  // Goes through each recording and filter, uses the filter function on
  // said recording, and constructs a data object to be used
  // by the BoxGraph component
  const createFilteredData = () => {
    let filteredData: FilteredData[] = $gestures.map(gesture => {
      let data = {
        name: gesture.name,
        points: {
          x: [] as number[],
          y: [] as number[],
          z: [] as number[],
        },
      };
      gesture.recordings.forEach(recording => {
        data.points.x.push(filterFunction(recording.data.x));
        data.points.y.push(filterFunction(recording.data.y));
        data.points.z.push(filterFunction(recording.data.z));
      });
      return data;
    });
    return filteredData;
  };

  // TODO: Formalize how/if live data is presented for different filters (in filter strategy?)
  const compareWithLive = (
    [Filters.MAX, Filters.MIN, Filters.MEAN] as FilterType[]
  ).includes(filter);

  $: isActive = $settings.includedFilters.has(filter);

  const toggleFilter = () => {
    settings.update(s => {
      if (s.includedFilters.has(filter)) {
        s.includedFilters.delete(filter);
      } else {
        s.includedFilters.add(filter);
      }
      return s;
    });
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="
      bg-white
      h-min
      hover:bg-sky-100
      duration-200
      cursor-pointer
      overflow-hidden
      rounded-lg
      m-2
      relative
      {isActive ? 'shadow-lg' : ''}"
  on:click={() => {
    console.warn('Open filter details not implemented');
  }}>
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
    <BoxGraph dataRep={createFilteredData()} sensitivity={undefined} {compareWithLive} />
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

<script lang="ts">
  import Information from '../../components/information/Information.svelte';
  import { FilterType, Axes, determineFilter } from '../../script/datafunctions';
  import { gestures, livedata, settings } from '../../script/stores/mlStore';
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

  // const filteredData: {
  //   name: string;
  //   points: {
  //     x: number[];
  //     y: number[];
  //     z: number[];
  //   };
  // }[] = $gestures.map(gesture => {
  //   return {
  //     name: gesture.name,
  //     points: gesture.recordings.reduce(recording => {
  //       return {
  //         Axes: recording.,
  //         y: ,
  //         z: ,
  //       }
  //     })
  //   }
  // })

  const createFilteredData = () => {
    const filterObject = determineFilter(filter);
    let filterFunction = (data: number[]) => filterObject.computeOutput(data);
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

  // [
  //   {
  //     name: '1',
  //     points: {
  //       x: [0, 2, 3],
  //       y: [1, 0, 3],
  //       z: [1, 2, 0],
  //     },
  //   },
  //   {
  //     name: '2',
  //     points: {
  //       x: [1, 0, 3],
  //       y: [1, 2, -1],
  //       z: [0, 2, 2],
  //     },
  //   },
  //   {
  //     name: '3',
  //     points: {
  //       x: [1, 2, 3],
  //       y: [1, 2, 3],
  //       z: [1, 2, 3],
  //     },
  //   },
  // ];
  // const meh = 2;
  // console.log($settings.includedFilters);
  $: isActive = $settings.includedFilters.has(filter);
  // console.log(isActive, $settings.includedFilters.has(filter));

  const toggleFilter = () => {
    console.log('Livedata:', $livedata);
    console.log('gestures:', $gestures);
    settings.update(s => {
      if (s.includedFilters.has(filter)) {
        s.includedFilters.delete(filter);
      } else {
        s.includedFilters.add(filter);
      }
      return s;
      // console.log(s.includedFilters.forEach(f => console.log(f.toString())));
      // // console.log(s.includedFilters);
      // let x = s.includedFilters.delete(filter);
      // console.log(s.includedFilters.forEach(f => console.log(f.toString())));
      // console.log(filter, x);
      // console.log('SETTINGS', s);
      // return s;
    });
    // const testSet = new Set<Filters>([
    //   Filters.MAX,
    //   Filters.MEAN,
    //   Filters.MIN,
    //   Filters.STD,
    //   Filters.PEAKS,
    //   Filters.ACC,
    //   Filters.ZCR,
    //   Filters.RMS,
    // ]);
    // console.log(testSet);
    // console.log(testSet.has(Filters.MAX));
    // console.log(testSet.has(filter));
    // isActive = !isActive;
    // console.warn('Filter toogling not implemented');
  };
</script>

<div>
  <!-- Some filter -->

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="
      bg-white
      h-min
      hover:bg-sky-100
      duration-200
      transform
      cursor-pointer
      overflow-hidden
      rounded-lg
      m-2
      relative
      {isActive ? 'shadow-lg' : ''}"
    on:click={() => {
      console.log('Open filter details not implemented');
    }}>
    <div class="filter flex justify-between">
      <div class="flex flex-row">
        <h2 class="m-2 ml-10 line-through" class:line-through={false}>
          {filter.toString()}
          <Information
            bodyText={'Some Body Text'}
            titleText={'Some Tilte Text'}
            isLightTheme={false} />
        </h2>
      </div>

      <!-- Deleting button -->
      <div
        class="mr-2 mt-2 cursor-pointer"
        on:click|stopPropagation={() => {
          toggleFilter();
          // console.log('Toggle filter not implemented');
        }}>
        <i
          class="fa-lg transition ease {isActive
            ? 'far fa-times-circle text-red-500 hover:(transform scale-150)'
            : 'fas fa-plus-circle text-lime-600 hover:(transform scale-150)'}" />
      </div>
    </div>
    <div class="w-full h-min">
      <!-- liveValues={{ x: 0, y: 0, z: 0 }} -->
      <BoxGraph dataRep={createFilteredData()} sensitivity={undefined} />
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
    <!-- Percentage -->
    <!-- <div class="w-full">
        <div
          class="bg-lime-400 h-2"
          style="width: {100 * filter.sensitivity}%"
        />
      </div>
    -->
  </div>
</div>

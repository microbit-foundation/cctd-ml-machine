<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
  import { state } from '../../script/stores/uiStore';
  import { GestureData, currentData, gestures } from '../../script/stores/mlStore';
  import {
    Axes,
    AxesType,
    FilterType,
    Filters,
    clamp,
    determineFilter,
  } from '../../script/datafunctions';

  export let filter: FilterType;
  export let gesture: GestureData | undefined = undefined;
  export let legendPosition: 'top' | 'right' = 'top';
  export let aspectRatio: number | undefined = undefined;
  export let displayLegend = true;
  export let displayYTicks = true;
  export let forcedColor: string | undefined = undefined;

  $: showLive = $state.isInputConnected;

  type FilteredData = {
    name: string;
    points: {
      x: number[];
      y: number[];
      z: number[];
    };
  };

  const filterStrategy = determineFilter(filter);
  const filterFunction = (data: number[]) => filterStrategy.computeOutput(data);

  const createFilteredData = () => {
    let usedGestures = gesture === undefined ? $gestures : [gesture];
    let filteredData: FilteredData[] = usedGestures.map(gesture => {
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

  const dataRepresentation = createFilteredData();

  const compareWithLive = (
    [Filters.MAX, Filters.MIN, Filters.MEAN] as FilterType[]
  ).includes(filter);

  // TODO: Handle sensitivity and extraconfig
  // export let sensitivity: Vector3 | undefined = undefined;
  // export let extraConfig = {};
  // Keeping this as a comment in case it is needed reimplementation of later features
  // export let forcedColor: string | undefined = undefined;

  function getColor(index: number): string {
    const colors = [
      '#f9808e',
      '#80f98e',
      '#808ef9',
      '#80dfff',
      '#df80ff',
      '#ffdf80',
      '#ff3333',
      '#33ff33',
      '#3333ff',
    ];
    return colors[index % colors.length];
  }

  let isMounted = false;
  onMount(() => {
    isMounted = true;
  });

  const labels: AxesType[] = Object.values(Axes);

  function produceMaxMin(): {
    min: number;
    max: number;
    diff: number;
  } {
    let min = Infinity;
    let max = -Infinity;

    dataRepresentation.forEach(data => {
      labels.forEach(label => {
        const newMax = Math.max(...data.points[label]);
        if (max < newMax) {
          max = newMax;
        }

        const newMin = Math.min(...data.points[label]);
        if (newMin < min) {
          min = newMin;
        }
      });
    });

    return { max, min, diff: Math.abs(max - min) };
  }

  const maxMin = produceMaxMin();

  let axisScale = {
    max: maxMin.max + 0.1 * maxMin.diff,
    min: maxMin.min - 0.1 * maxMin.diff,
  };

  function onNewLiveValues(
    values: { x: number; y: number; z: number },
    isConnected: boolean,
  ) {
    if (!isMounted) {
      return;
    }
    if (!showLive || !isConnected) {
      data.datasets[0].hidden = true;
      chart.update();
      return;
    }
    // TODO: Reconsider how to best update graph if values goes outside axes scales
    data.datasets[0].data[0] = clamp(values.x, axisScale.min, axisScale.max);
    data.datasets[0].data[1] = clamp(values.y, axisScale.min, axisScale.max);
    data.datasets[0].data[2] = clamp(values.z, axisScale.min, axisScale.max);
    data.datasets[0].hidden = false;
    chart.update();
  }

  const data: ChartData = {
    labels: labels,
    datasets: [],
  };

  const populateData = () => {
    if (compareWithLive) {
      data.datasets.push({
        label: 'Live Data',
        backgroundColor: '#000000',
        data: [$currentData.x, $currentData.y, $currentData.z],
        type: 'line',
        hidden: !showLive,
      });
    }
    dataRepresentation.forEach((dataPoint, idx) => {
      data.datasets.push({
        label: dataPoint.name,
        // TODO: Handle scaling/normalization of data in a better way than simply dividing by 40
        data: [
          [
            Math.min(...dataPoint.points.x) - maxMin.diff / 40,
            Math.max(...dataPoint.points.x) + maxMin.diff / 40,
          ],
          [
            Math.min(...dataPoint.points.y) - maxMin.diff / 40,
            Math.max(...dataPoint.points.y) + maxMin.diff / 40,
          ],
          [
            Math.min(...dataPoint.points.z) - maxMin.diff / 40,
            Math.max(...dataPoint.points.z) + maxMin.diff / 40,
          ],
        ],
        backgroundColor: forcedColor ?? getColor(idx),
        type: 'bar',
      });
    });
  };
  populateData();

  const config: ChartConfiguration = {
    type: 'line',
    data: data,
    options: {
      aspectRatio: aspectRatio,
      elements: {
        line: {
          borderWidth: 0,
        },
        point: {
          radius: 25,
          pointStyle: 'line',
          borderWidth: 1,
          borderColor: '#000000',
        },
      },
      scales: {
        y: {
          min: axisScale.min,
          max: axisScale.max,
          ticks: {
            display: displayYTicks,
          },
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: legendPosition,
          display: displayLegend,
        },
        title: {
          display: false,
        },
      },
    },
  };

  // TODO: Reimplement sensitivity
  // (sensitivity =>
  // $: {
  //   if (sensitivity !== undefined) {
  //     //   return;
  //     // }
  //     config.data.labels = [
  //       'x ' + sensitivity.x + '%',
  //       'y ' + sensitivity.y + '%',
  //       'z ' + sensitivity.z + '%',
  //     ];
  //   }
  // }
  // )(sensitivity);

  $: {
    if (compareWithLive) {
      onNewLiveValues($currentData, $state.isInputConnected);
    }
  }

  let chart: Chart;
  let canvas: HTMLCanvasElement;
  onMount(() => {
    Chart.register(...registerables);
    if (canvas.getContext('2d') != null) {
      chart = new Chart(canvas.getContext('2d') ?? new HTMLCanvasElement(), config);
      // TODO: Remember extraConfig
    }
  });
</script>

<canvas bind:this={canvas} id="myChart" />

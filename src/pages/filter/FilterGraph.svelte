<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
  import { state } from '../../script/stores/uiStore';
  import { GestureData, gestures } from '../../script/stores/mlStore';
  import {
    Axes,
    AxesType,
    FilterType,
    clamp,
    determineFilter,
  } from '../../script/datafunctions';
  import { getPrevData } from '../../script/stores/mlStore';

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
    console.log("filtered data", filteredData);
    return filteredData;
  };

  let liveData: [number, number, number] = [0, 0, 0];

  const createLiveData = () => {
    if (!showLive) {
      data.datasets[0].hidden = true;
      chart.update();
      return;
    }
    const prevData = getPrevData();
    // Return if insufficient amount of previous data is available
    if( prevData === undefined ) return;
    liveData = [
      filterFunction(prevData.x),
      filterFunction(prevData.y),
      filterFunction(prevData.z)
    ];
      // TODO: Reconsider how to best update graph if values goes outside axes scales
    data.datasets[0].data[0] = clamp(liveData[0], axisScale.min, axisScale.max);
    data.datasets[0].data[1] = clamp(liveData[1], axisScale.min, axisScale.max);
    data.datasets[0].data[2] = clamp(liveData[2], axisScale.min, axisScale.max);
    data.datasets[0].hidden = false;
    chart.update();
  }

  onInterval(createLiveData, 100);

function onInterval(callback: () => void, milliseconds: number) {
	const interval = setInterval(callback, milliseconds);
	onDestroy(() => {
		clearInterval(interval);
	});
}

  const dataRepresentation = createFilteredData();



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

  const data: ChartData = {
    labels: labels,
    datasets: [],
  };

  const populateData = () => {
    data.datasets.push({
      label: 'Live Data',
      backgroundColor: '#000000',
      data: liveData,
      type: 'line',
      hidden: !showLive,
    });

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

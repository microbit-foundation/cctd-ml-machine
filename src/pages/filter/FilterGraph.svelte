<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Chart,
    LinearScale,
    CategoryScale,
    ChartConfiguration,
    ChartData,
    LineElement,
    PointElement,
    LineController,
    Legend,
  } from 'chart.js';
  import { ViolinController, Violin } from '@sgratzl/chartjs-chart-boxplot';
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
    if (prevData === undefined) return;
    liveData = [
      filterFunction(prevData.x),
      filterFunction(prevData.y),
      filterFunction(prevData.z),
    ];
    // TODO: Reconsider how to best update graph if values goes outside axes scales
    data.datasets[0].data[0] = clamp(liveData[0], axisScale.min, axisScale.max);
    data.datasets[0].data[1] = clamp(liveData[1], axisScale.min, axisScale.max);
    data.datasets[0].data[2] = clamp(liveData[2], axisScale.min, axisScale.max);
    data.datasets[0].hidden = false;
    chart.update();
  };

  onInterval(createLiveData, 100);

  function onInterval(callback: () => void, milliseconds: number) {
    const interval = setInterval(callback, milliseconds);
    onDestroy(() => {
      clearInterval(interval);
    });
  }

  const dataRepresentation = createFilteredData();

  function getColor(index: number): string {
    const colors = [
      '#007bff',
      '#93003a',
      '#9a94ea',
      '#ce3664',
      '#f2778d',
      '#d0b2db',
      '#ffbcb8',
      '#ffffe0',
      '#f3d5d5',
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
      data: liveData,
      type: 'line',
      hidden: !showLive,
    });

    dataRepresentation.forEach((dataPoint, idx) => {
      data.datasets.push({
        itemRadius: 3,
        itemBackgroundColor: getColor(idx) + 'ff',
        label: dataPoint.name,
        data: [dataPoint.points.x, dataPoint.points.y, dataPoint.points.z],
        backgroundColor: forcedColor ?? getColor(idx) + '4D', // 4D is 30% opacity
      });
    });
  };
  populateData();

  const config: ChartConfiguration = {
    type: 'violin',
    data: data,
    options: {
      aspectRatio: aspectRatio,
      elements: {
        line: {
          borderWidth: 3,
        },
        point: {
          radius: 3,
          pointStyle: 'point',
          backgroundColor: '#000000',
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
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: legendPosition,
          display: displayLegend,
          onClick: () => {},
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
    Chart.register(
      ViolinController,
      Violin,
      LinearScale,
      CategoryScale,
      LineElement,
      PointElement,
      LineController,
      Legend,
    );
    if (canvas.getContext('2d') != null) {
      chart = new Chart(canvas.getContext('2d') ?? new HTMLCanvasElement(), config);
    }
  });
</script>

<canvas bind:this={canvas} id="myChart" />

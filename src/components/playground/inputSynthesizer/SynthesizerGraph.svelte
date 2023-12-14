<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { SmoothieChart, TimeSeries } from 'smoothie';
  import LiveData from '../../../script/domain/LiveData';
  import SmoothedLiveData from '../../../script/livedata/SmoothedLiveData';
  import { onMount } from 'svelte';
  import StaticConfiguration from '../../../StaticConfiguration';
  import { state } from '../../../script/stores/uiStore';
  import DimensionLabels from '../../graphs/DimensionLabels.svelte';

  /**
   * TimesSeries, but with the data array added.
   * `data[i][0]` is the timestamp,
   * `data[i][1]` is the value,
   */
  type TimeSeriesWithData = TimeSeries & { data: number[][] };

  // Updates width to ensure that the canvas fills the whole screen
  export let width: number;
  export let liveData: LiveData<any>;
  export let maxValue: number;
  export let minValue: number;

  // Smoothes real-time data by using the 3 most recent data points
  const smoothedLiveData = new SmoothedLiveData(liveData, 3);

  var canvas: HTMLCanvasElement | undefined = undefined;
  var chart: SmoothieChart | undefined;
  const lines: TimeSeriesWithData[] = [];

  for (let i = 0; i < smoothedLiveData.getSeriesSize(); i++) {
    lines.push(new TimeSeries() as TimeSeriesWithData);
  }
  let recordLines = new TimeSeries();
  const lineWidth = 2;

  // On mount draw smoothieChart
  onMount(() => {
    chart = new SmoothieChart({
      maxValue,
      minValue,
      millisPerPixel: 7,
      grid: {
        fillStyle: '#ffffff00',
        strokeStyle: 'rgba(48,48,48,0.20)',
        millisPerLine: 3000,
        borderVisible: false,
      },
      interpolation: 'linear',
    });

    let i = 0;
    for (const line of lines) {
      chart.addTimeSeries(line, {
        lineWidth,
        strokeStyle: StaticConfiguration.liveGraphColors[i],
      });
      i++;
    }

    chart.addTimeSeries(recordLines, {
      lineWidth: 3,
      strokeStyle: '#4040ff44',
      fillStyle: '#0000ff07',
    });
    chart.streamTo(<HTMLCanvasElement>canvas, 0);
    chart.start();
  });

  const addDataToGraphLines = (data: any) => {
    const t = new Date().getTime();
    let i = 0;
    for (const property in data) {
      const line: TimeSeriesWithData = lines[i];
      if (!line) {
        break;
      }
      const newValue = data[property];
      line.append(t, newValue, false);
      i++;
    }
  };

  smoothedLiveData.subscribe(data => {
    addDataToGraphLines(data);
  });
</script>

<main class="flex">
  <canvas bind:this={canvas} height="160" id="smoothie-chart" width={width - 30} />
  <DimensionLabels {minValue} graphHeight={160} {maxValue} liveData={smoothedLiveData} />
</main>

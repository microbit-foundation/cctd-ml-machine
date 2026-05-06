<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { writable, type Unsubscriber } from 'svelte/store';
  import { SmoothieChart, TimeSeries } from 'smoothie';
  import DimensionLabels from './DimensionLabels.svelte';
  import StaticConfiguration from '../../../StaticConfiguration';
  import SmoothedLiveData from '../../../lib/livedata/SmoothedLiveData';
  import { Feature, getFeature } from '../../../lib/FeatureToggles';
  import type { LiveDataVector } from '../../../core/vector/LiveDataVector';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import type { LiveDataStore } from '../../../core/LiveDataStore';
  import type { AbstractState } from '../../../backend/statemanagement/AbstractState';

  /**
   * TimesSeries, but with the data array added.
   * `data[i][0]` is the timestamp,
   * `data[i][1]` is the value,
   */
  type TimeSeriesWithData = TimeSeries & { data: number[][] };

  // Updates width to ensure that the canvas fills the whole screen
  export let width: number;
  export let liveData: AbstractState<LiveDataStore<LiveDataVector>>;
  export let maxValue: number;
  export let minValue: number;

  console.log(width);

  let axisColors = StaticConfiguration.graphColors;

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
  const recordingState = getControllers().getRecordingController().getRecordingState();
  const selectedAxes = getControllers().getDataController().getSelectedAxes();

  // Smoothes real-time data by using the 3 most recent data points
  let smoothedLiveData = new SmoothedLiveData<LiveDataVector>(liveData, 3);

  var canvas: HTMLCanvasElement | undefined = undefined;

  let timeSeries: TimeSeriesWithData[] = [];
  let recordLines = new TimeSeries();
  let blockRecordingStart = false;

  let chart: SmoothieChart | undefined;

  onMount(() => {
    chart = createChart();
    return () => {
      if (chart) {
        chart.stop();
      }
    };
  });

  $: {
    const time = new Date().getTime();
    const values = $smoothedLiveData.getValue();
    if (timeSeries.length !== values.length) {
      timeSeries = values.map(() => new TimeSeries() as TimeSeriesWithData);
      if (canvas) {
        chart = createChart();
      }
    }
    timeSeries.forEach((ts, idx) => {
      const val = values[idx];
      ts.append(time, val, false);
    });
  }

  $: recordingStarted($recordingState.isRecording());

  // Draw on graph to display that users are recording.
  // blockRecordingStart prevents jagged edges caused by the function repeating.
  function recordingStarted(isRecording: boolean): void {
    if (!isRecording || blockRecordingStart) {
      return;
    }

    recordLines.append(new Date().getTime() - 1, minValue, false);
    recordLines.append(new Date().getTime(), maxValue, false);

    blockRecordingStart = true;
    setTimeout(() => {
      recordLines.append(new Date().getTime() - 1, maxValue, false);
      recordLines.append(new Date().getTime(), minValue, false);
      blockRecordingStart = false;
    }, getFeature<number>(Feature.RECORDING_DURATION));
  }

  const createChart = () => {
    if (chart) {
      chart.stop();
    }
    const newChart = new SmoothieChart({
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
    timeSeries.forEach((ts, idx) => {
      if ($selectedAxes.some(e => e.index === idx)) {
        const color = axisColors[idx];
        newChart.addTimeSeries(ts, {
          strokeStyle: color,
        });
      }
    });
    newChart.addTimeSeries(recordLines, {
      lineWidth: 3,
      strokeStyle: '#4040ff44',
      fillStyle: '#0000ff07',
    });
    newChart.streamTo(<HTMLCanvasElement>canvas, 0);
    return newChart;
  };
</script>

<main class="flex">
  <canvas bind:this={canvas} height="160" width={width - 30} />
  <DimensionLabels
    hidden={!$microbitConnection.getInput().isConnected()}
    {minValue}
    graphHeight={160}
    {maxValue}
    liveData={smoothedLiveData} />
</main>

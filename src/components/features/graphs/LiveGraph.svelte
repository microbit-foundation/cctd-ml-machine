<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { type Unsubscriber } from 'svelte/store';
  import { SmoothieChart, TimeSeries } from 'smoothie';
  import DimensionLabels from './DimensionLabels.svelte';
  import { state, stores } from '../../../lib/stores/Stores';
  import type { LiveData } from '../../../lib/domain/stores/LiveData';
  import type { LiveDataVector } from '../../../lib/domain/stores/LiveDataVector';
  import StaticConfiguration from '../../../StaticConfiguration';
  import SmoothedLiveData from '../../../lib/livedata/SmoothedLiveData';

  /**
   * TimesSeries, but with the data array added.
   * `data[i][0]` is the timestamp,
   * `data[i][1]` is the value,
   */
  type TimeSeriesWithData = TimeSeries & { data: number[][] };
  const classifier = stores.getClassifier();

  // Updates width to ensure that the canvas fills the whole screen
  export let width: number;
  export let liveData: LiveData<LiveDataVector>;
  export let maxValue: number;
  export let minValue: number;

  let axisColors = StaticConfiguration.graphColors;

  const highlightedAxes = stores.getHighlightedAxes();

  // Smoothes real-time data by using the 3 most recent data points
  let smoothedLiveData = new SmoothedLiveData<LiveDataVector>(liveData, 3);
  let cnt = 0;

  // Subscribing to the stores object, allows us to detect changes in the LiveData store
  // Without it, reconnecting would cause the component to use an outdated reference of the liveData store.
  stores.subscribe(e => {
    cnt++; // The cnt variable is the key that will force the dimension labels to update
    if (e.liveData !== undefined) {
      smoothedLiveData = new SmoothedLiveData(e.liveData, 3);
    }
  });

  var canvas: HTMLCanvasElement | undefined = undefined;
  var chart: SmoothieChart | undefined;
  const lines: TimeSeriesWithData[] = [];

  for (let i = 0; i < smoothedLiveData.getSeriesSize(); i++) {
    lines.push(new TimeSeries() as TimeSeriesWithData);
  }

  let recordLines = new TimeSeries();
  const lineWidth = 2;

  const init = () => {
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

    lines.forEach((line, index) => {
      const opaque = highlightedAxes.isAxisIndexHighlighted(index);
      const color = axisColors[index] + (opaque ? 'ff' : '00');
      chart!.addTimeSeries(line, {
        lineWidth,
        strokeStyle: color,
      });
    });

    chart.addTimeSeries(recordLines, {
      lineWidth: 3,
      strokeStyle: '#4040ff44',
      fillStyle: '#0000ff07',
    });
    chart.streamTo(<HTMLCanvasElement>canvas, 0);
    chart.stop();
  };

  // On mount draw smoothieChart
  onMount(() => {
    init();
  });

  // Start and stop chart when microbit connect/disconnect
  const model = classifier.getModel();
  $: {
    if (chart !== undefined) {
      if ($state.isInputReady) {
        if (!$model.isTraining) {
          chart.start();
        } else {
          chart.stop();
        }
      } else {
        chart.stop();
      }
    }
  }

  // Draw on graph to display that users are recording
  // The jagged edges problem is caused by repeating the recordingStarted function.
  // We will simply block the recording from starting, while it's recording
  let blockRecordingStart = false;
  $: recordingStarted($state.isRecording);

  // Function to clearly diplay the area in which users are recording
  function recordingStarted(isRecording: boolean): void {
    if (!isRecording || blockRecordingStart) {
      return;
    }

    // Set start line
    recordLines.append(new Date().getTime() - 1, minValue, false);
    recordLines.append(new Date().getTime(), maxValue, false);

    // Wait a second and set end line
    blockRecordingStart = true;
    setTimeout(() => {
      recordLines.append(new Date().getTime() - 1, maxValue, false);
      recordLines.append(new Date().getTime(), minValue, false);
      blockRecordingStart = false;
    }, StaticConfiguration.recordingDuration);
  }

  // When state changes, update the state of the canvas
  $: {
    const isConnected = $state.isInputReady;
    updateCanvas(isConnected);
  }

  let unsubscribeFromData: Unsubscriber | undefined;

  // If state is connected. Start updating the graph whenever there is new data
  // From the Micro:Bit
  function updateCanvas(isConnected: boolean) {
    if (isConnected || !unsubscribeFromData) {
      unsubscribeFromData = smoothedLiveData.subscribe(data => {
        if (!liveData.getBuffer().isEmpty()) {
          addDataToGraphLines(data);
        }
      });

      // Else if we're currently subscribed to data. Unsubscribe.
      // This means that the micro:bit has been disconnected
    } else if (unsubscribeFromData !== undefined) {
      unsubscribeFromData();
      unsubscribeFromData = undefined;
    }
  }

  const addDataToGraphLines = (data: LiveDataVector) => {
    const t = new Date().getTime();
    let i = 0;
    for (const num of data.getValue()) {
      const line: TimeSeriesWithData = lines[i];
      if (!line) {
        break;
      }
      const newValue = num;
      line.append(t, newValue, false);
      i++;
    }
  };
</script>

<main class="flex">
  <canvas bind:this={canvas} height="160" id="smoothie-chart" width={width - 30} />
  {#key cnt}
    <DimensionLabels
      hidden={!$state.isInputConnected}
      {minValue}
      graphHeight={160}
      {maxValue}
      liveData={smoothedLiveData} />
  {/key}
</main>

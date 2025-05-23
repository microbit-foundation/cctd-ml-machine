<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<!--
<script lang="ts">
  import { SmoothieChart, TimeSeries } from 'smoothie';
  import SmoothedLiveData from '../../../script/livedata/SmoothedLiveData';
  import { onMount } from 'svelte';
  import StaticConfiguration from '../../../StaticConfiguration';
  import DimensionLabels from '../../graphs/DimensionLabels.svelte';
  import LiveData from '../../../script/domain/stores/LiveData';

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
-->
<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { SmoothieChart, TimeSeries } from 'smoothie';
  import { onDestroy, onMount } from 'svelte';
  import { type Unsubscriber } from 'svelte/motion';
  import liveDataSynthesizer from './LiveDataSynthesizer';
  import { stores } from '../../../../lib/stores/Stores';
  import type { LiveData } from '../../../../lib/domain/stores/LiveData';
  import type { LiveDataVector } from '../../../../lib/domain/stores/LiveDataVector';
  import StaticConfiguration from '../../../../StaticConfiguration';
  import SmoothedLiveData from '../../../../lib/livedata/SmoothedLiveData';
  import DimensionLabels from '../../graphs/DimensionLabels.svelte';

  const classifier = stores.getClassifier();

  /**
   * TimesSeries, but with the data array added.
   * `data[i][0]` is the timestamp,
   * `data[i][1]` is the value,
   */
  type TimeSeriesWithData = TimeSeries & { data: number[][] };

  // Updates width to ensure that the canvas fills the whole screen
  export let width: number;
  export let liveData: LiveData<LiveDataVector>;
  export let maxValue: number;
  export let minValue: number;

  let axisColors = StaticConfiguration.graphColors;

  // Smoothes real-time data by using the 3 most recent data points
  const smoothedLiveData = new SmoothedLiveData<LiveDataVector>(liveData, 3);

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

    let i = 0;
    for (const line of lines) {
      chart.addTimeSeries(line, {
        lineWidth,
        strokeStyle: axisColors[i],
      });
      i++;
    }

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
      if ($liveDataSynthesizer.isActive) {
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

  // When state changes, update the state of the canvas
  $: {
    const isConnected = $liveDataSynthesizer.isActive;
    updateCanvas(isConnected);
  }

  let unsubscribeFromData: Unsubscriber | undefined;

  onDestroy(() => {
    unsubscribeFromData && unsubscribeFromData();
  });

  // If state is connected. Start updating the graph whenever there is new data
  // From the Micro:Bit
  function updateCanvas(isConnected: boolean) {
    if (isConnected) {
      unsubscribeFromData = smoothedLiveData.subscribe(data => {
        addDataToGraphLines(data);
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
        console.log('NO LINE');
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
  <DimensionLabels {minValue} graphHeight={160} {maxValue} liveData={smoothedLiveData} />
</main>

<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
  import { state } from '../../script/stores/uiStore';
  import { currentData } from '../../script/stores/mlStore';
  import { Axes, AxesType, clamp } from '../../script/datafunctions';

  export let dataRep: {
    name: string;
    points: {
      x: number[];
      y: number[];
      z: number[];
    };
  }[];

  export let compareWithLive = false;

  $: showLive = $state.isInputConnected;

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

    dataRep.forEach(data => {
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

  const maxmin = produceMaxMin();

  let axisScale = {
    max: maxmin.max + 0.1 * maxmin.diff,
    min: maxmin.min - 0.1 * maxmin.diff,
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
    dataRep.forEach((dataPoint, idx) => {
      data.datasets.push({
        label: dataPoint.name,
        // TODO: Handle scaling/normalization of data in a better way than simply dividing by 40
        data: [
          [
            Math.min(...dataPoint.points.x) - maxmin.diff / 40,
            Math.max(...dataPoint.points.x) + maxmin.diff / 40,
          ],
          [
            Math.min(...dataPoint.points.y) - maxmin.diff / 40,
            Math.max(...dataPoint.points.y) + maxmin.diff / 40,
          ],
          [
            Math.min(...dataPoint.points.z) - maxmin.diff / 40,
            Math.max(...dataPoint.points.z) + maxmin.diff / 40,
          ],
        ],
        // backgroundColor: forcedColor ?? getColor(idx), // TODO: Remove or reimplement
        backgroundColor: getColor(idx),
        type: 'bar',
      });
    });
  };
  populateData();

  const config: ChartConfiguration = {
    type: 'line',
    data: data,
    options: {
      aspectRatio: 1.5,
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
        y: axisScale,
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
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

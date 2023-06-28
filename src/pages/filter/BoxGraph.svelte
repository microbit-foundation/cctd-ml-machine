<script lang="ts">
  import { onMount } from 'svelte';
  import { Vector3 } from '../../components/3d-inspector/View3DUtility';
  import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
  import { state } from '../../script/stores/uiStore';
  import { currentData } from '../../script/stores/mlStore';
  import { clamp } from '../../script/datafunctions';

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

  // export let liveValues = { x: 0, y: 0, z: 0 };
  export let sensitivity: Vector3 | undefined = undefined;
  export let extraConfig = {};
  export let forceColor: string | undefined = undefined;

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

  type MaxMin = {
    min: number;
    max: number;
    diff: number;
  };
  type axis = 'x' | 'y' | 'z';
  const labels: axis[] = ['x', 'y', 'z'];

  function produceMaxMin(): MaxMin {
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
    // const d = data.datasets[0].data;
    data.datasets[0].data[0] = clamp(values.x, axisScale.min, axisScale.max);
    data.datasets[0].data[1] = clamp(values.y, axisScale.min, axisScale.max);
    data.datasets[0].data[2] = clamp(values.z, axisScale.min, axisScale.max);
    data.datasets[0].hidden = false;
    // const max = Math.max(values.x, values.y, values.z);
    // axisScale.max = Math.max(maxmin.max + 0.1 * maxmin.diff, max);
    // const min = Math.min(values.x, values.y, values.z);
    // axisScale.min = Math.min(maxmin.min - 0.1 * maxmin.diff, min);
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
        backgroundColor: forceColor ?? getColor(idx),
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
  // $: {
  //   console.log('HERE', $state.isInputConnected);
  //   data.datasets[0].hidden = !$state.isInputConnected;
  //   console.log(data.datasets[0].hidden);
  //   chart.update();
  // }

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

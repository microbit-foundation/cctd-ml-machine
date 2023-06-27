<script lang="ts">
  import { onMount } from 'svelte';
  import { Vector3 } from '../../components/3d-inspector/View3DUtility';
  import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
  import { state } from '../../script/stores/uiStore';
  import { currentData } from '../../script/stores/mlStore';

  // type dataRepType = {
  //   name: string,
  //   points: {
  //     x: number[],
  //     y: number[],
  //     z: number[]
  //   }
  // }

  export let dataRep: {
    name: string;
    points: {
      x: number[];
      y: number[];
      z: number[];
    };
  }[];

  $: showLive = $state.isInputConnected;
  $: {
    console.log($state.isInputConnected);
  }

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
    let min = 3.40282347e38; // largest positive number in float32
    let max = -3.40282347e38; // largest negative number in float32

    dataRep.forEach(data => {
      labels.forEach(label => {
        const newMax = Math.max(...data.points[label]);
        if (max < newMax) max = newMax;

        const newMin = Math.min(...data.points[label]);
        if (newMin < min) min = newMin;
      });
    });

    return { max, min, diff: Math.abs(max - min) };
  }

  const maxmin = produceMaxMin();

  function onNewLiveValues(values: { x: number; y: number; z: number }) {
    if (!isMounted) {
      return;
    }
    if (!showLive) {
      data.datasets[0].hidden = true;
      chart.update();
      return;
    }
    const d = data.datasets[0].data;
    d[0] = values.x;
    d[1] = values.y;
    d[2] = values.z;
    data.datasets[0].hidden = false;
    chart.update();
  }

  const data = {
    labels: labels,
    //[
    datasets: [
      {
        label: 'Live Data',
        backgroundColor: '#000000',
        data: [$currentData.x, $currentData.y, $currentData.z],
        type: 'line',
        hidden: !showLive,
      },
      ...dataRep.map((data, index) => {
        return {
          label: data.name,
          data: [
            [
              Math.min(...data.points.x) - maxmin.diff / 40,
              Math.max(...data.points.x) + maxmin.diff / 40,
            ],
            [
              Math.min(...data.points.y) - maxmin.diff / 40,
              Math.max(...data.points.y) + maxmin.diff / 40,
            ],
            [
              Math.min(...data.points.z) - maxmin.diff / 40,
              Math.max(...data.points.z) + maxmin.diff / 40,
            ],
          ],
          backgroundColor: forceColor || getColor(index),
          type: 'bar',
        };
      }),
    ],
  };

  const config = {
    data,
    options: {
      aspectRatio: 1.5,
      elements: {
        line: {
          borderWidth: 0,
        },
        point: {
          radius: 50,
          pointStyle: 'line',
          borderWidth: 1,
          borderColor: '#000000',
        },
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

  // (sensitivity =>
  $: {
    if (sensitivity !== undefined) {
      //   return;
      // }
      config.data.labels = [
        'x ' + sensitivity.x + '%',
        'y ' + sensitivity.y + '%',
        'z ' + sensitivity.z + '%',
      ];
    }
  }
  // )(sensitivity);

  $: onNewLiveValues($currentData);

  let chart: Chart<keyof ChartTypeRegistry, number[][], string>;
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

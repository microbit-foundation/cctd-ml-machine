<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Chart, 
    ChartConfiguration, 
    ChartTypeRegistry, 
    LineController, 
    LineElement, 
    LinearScale,
    PointElement 
  } from 'chart.js';

  export let data: { x: number[]; y: number[]; z: number[] };

  function getConfig(): ChartConfiguration<keyof ChartTypeRegistry, {x: number, y: number}[], string> {
    const x: { x: number; y: number }[] = [];
    const y: { x: number; y: number }[] = [];
    const z: { x: number; y: number }[] = [];
    for (let i = 1; i < data.x.length; i++) {
      x.push({ x: i, y: data.x[i - 1] });
      y.push({ x: i, y: data.y[i - 1] });
      z.push({ x: i, y: data.z[i - 1] });
    }
    return {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'x',
            borderColor: 'red',
            borderWidth: 1,
            radius: 0,
            data: x,
          },
          {
            label: 'y',
            borderColor: 'green',
            borderWidth: 1,
            radius: 0,
            data: y,
          },
          {
            label: 'z',
            borderColor: 'blue',
            borderWidth: 1,
            radius: 0,
            data: z,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: data.x.length,
            grid: {
              color: '#f3f3f3',
            },
            ticks: {
              display: false, //this will remove only the label
            },
          },
          y: {
            type: 'linear',
            min: -2.5,
            max: 2.5,
            grid: {
              color: '#f3f3f3',
            },
            ticks: {
              display: false, //this will remove only the label
            },
          },
        },
      },
    };
  }

  let canvas: HTMLCanvasElement;
  onMount(() => {
    Chart.register([LinearScale, LineController, PointElement, LineElement]);
    const chart = new Chart(canvas.getContext('2d') ?? new HTMLCanvasElement(), getConfig());
    return () => {
      chart.destroy()
    }
  });


</script>

<canvas 
  bind:this="{canvas}" 
  on:mouseenter={() => console.log("Enter")}
  on:mouseleave={() => console.log("Leave")}
  on:mousemove={() => console.log("Move")}
  
/>

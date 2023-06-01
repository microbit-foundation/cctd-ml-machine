<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Chart, 
    ChartConfiguration, 
    ChartTypeRegistry, 
    LineController, 
    LineElement, 
    LinearScale,
    PointElement,
  } from 'chart.js';

  export let data: { x: number[]; y: number[]; z: number[] };

  let verticalLineX = NaN
  let hoverIndex = NaN
  const verticalLineCol = 'black'
  const verticalLineWidth = 1

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
            pointRadius: 0,
            pointHoverRadius: 0,
            data: x,
          },
          {
            label: 'y',
            borderColor: 'green',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 0,
            data: y,
          },
          {
            label: 'z',
            borderColor: 'blue',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 0,
            data: z,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
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
        // onClick: (e) => {
        //   console.log(e)
        // },
        // onHover: (e) => {
        //   e.native?.()
        //   console.log(e)
        // }
      },
      plugins: [
        {
          id: 'mouseLine',
          afterEvent: (chart, args) => {
            if (!args.inChartArea || args.event.type == 'mouseout'){
              // TODO: Close/reset stuff for dialog/modal
              verticalLineX = NaN
              hoverIndex = NaN
              return
            }
            // TODO: If dialog/modal is closed, open it
            // TODO: Update modal data
            verticalLineX = args.event.x ?? NaN
            if (args.event.native != null){
              hoverIndex = chart.getElementsAtEventForMode(args.event.native, 'nearest', {}, true)[0].index
            } else {
              hoverIndex = NaN
            }
          },
          afterDraw: function (chart) {
            var ctx = chart.ctx
            var chartArea = chart.chartArea

            if (!isNaN(verticalLineX)) {
              ctx.save()
              ctx.strokeStyle = verticalLineCol
              ctx.lineWidth = verticalLineWidth
              let path = new Path2D()
              path.moveTo(verticalLineX, chartArea.bottom - 10)
              path.lineTo(verticalLineX, chartArea.top)
              ctx.stroke(path)
              ctx.restore()
            }
          }
        }
      ]
    };
  }

  // function computeInspectorPosition

  // function openInspector(): void {

  // }

  // function closeInspector() {

  // }


  let canvas: HTMLCanvasElement;
  onMount(() => {
    Chart.register([LinearScale, LineController, PointElement, LineElement]);
    const chart = new Chart(
      canvas.getContext('2d') ?? new HTMLCanvasElement(), 
      getConfig()
    );
    return () => {
      chart.destroy()
    }
  });


</script>

<div 
  class="h-full w-full relative"
>
  <div class="z-1 h-full w-full absolute">
    {#if !isNaN(hoverIndex)}
      <p
        style="margin-left: {verticalLineX-19}px; pointer-events:none;"
        class="absolute mt-20 w-10 text-center"
      >
        {hoverIndex}
      </p>
    {/if}
  
    <canvas bind:this={canvas} />
  </div>
</div>

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
  import { graphInspectorState } from '../3d-inspector/View3DUtility';
  import RecordingInspector from '../3d-inspector/RecordingInspector.svelte';
  import { element } from 'svelte/internal';

  export let data: { x: number[]; y: number[]; z: number[] };

  let verticalLineX = NaN
  let hoverIndex = NaN
  let modalPosition = {x: 0, y: 0};
  let modalSize = 250;
  const verticalLineCol = 'black'
  const verticalLineWidth = 1

  const getDataByIndex = (index: number) => {
    if (isNaN(index)){
      return {x: 0, y: 0, z: 0}
    }
    return {
      x: data.x[index],
      y: data.y[index],
      z: data.z[index],
    }
  }

  const lengthOfGraphsInPixels = 134;
  const ratio = (1 / data.x.length) * lengthOfGraphsInPixels;
  // let dataPointInFocusIndex = 0; // 10 to 144
  // let inspectorActive = false;
  // let inspectedDataPoint = writable({ x: 0, y: 0, z: 0 });
  let componentElement: HTMLDivElement;
  const inspectorMarginInPixels = 5;


  function recomputeModalParams(){
    const rect = componentElement.getBoundingClientRect()
    modalSize = generateSizeOfInspector(rect)
    modalPosition = generatePositionOfInspector(rect, modalSize)
  }

    /**
   * Positions in regards to size of modal following these rules:
   * - It prefers center-aligning with element in focus (The recording). Moves into view if circle
   * escapes the left or right side.
   * - It prefers showing downwards. Changes to upwards if downwards is not possible.
   * - It always positions at an offset from the element in focus.
   */
   function generatePositionOfInspector(rect: DOMRect, size: number): {x: number, y: number} {
    const rectCenterX = (rect.left + rect.right) / 2;
    let x = 0;
    let y = 0;

    // Calculate x value
    if (rectCenterX < size / 2) {
      // What the hell is this if structure
    } else if (window.innerWidth - rectCenterX < size / 2)
      x = window.innerWidth - size;
    else x = rectCenterX - size / 2;

    // Calculate y value
    if (window.innerHeight - rect.bottom - 15 < size) {
      y = rect.top - inspectorMarginInPixels - size;
    } else {
      y = rect.bottom + inspectorMarginInPixels;
    }

    return { x, y };
  }

  function generateSizeOfInspector(rect: DOMRect): number {
    return (window.innerHeight - rect.height) / 2 - inspectorMarginInPixels;
  }

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
      },
      plugins: [
        {
          id: 'mouseLine',
          afterEvent: (chart, args) => {
            if (!args.inChartArea || args.event.type === 'mouseout'){
              verticalLineX = NaN
              hoverIndex = NaN
              return
            }
            verticalLineX = args.event.x ?? NaN
            if (args.event.native != null){
              if (isNaN(hoverIndex)){
                recomputeModalParams()
              }
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
  // $ : {
  //   graphInspectorState.update(s => {
  //     s.isOpen = !isNaN(hoverIndex)
  //     s.dataPoint = {x: data.x[hoverIndex], y: data.y[hoverIndex], z: data.z[hoverIndex]}
  //     return s
  //   })
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
  bind:this={componentElement}
  class="h-full w-full relative"
>
  <div class="z-1 h-full w-full absolute">
    {#if !isNaN(hoverIndex)}
      <p
        style="margin-left: {verticalLineX-20}px; pointer-events:none;"
        class="absolute mt-20 w-10 text-center"
      >
        {hoverIndex}
      </p>
    {/if}
  
    <canvas bind:this={canvas} />
  </div>
  <RecordingInspector 
    dataPoint={getDataByIndex(hoverIndex)} 
    position={modalPosition} 
    isOpen={!isNaN(hoverIndex)}
    size={modalSize}
  />
</div>

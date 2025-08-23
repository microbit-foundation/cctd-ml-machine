<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Chart,
    registerables,
    type ChartConfiguration,
    type ChartTypeRegistry,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
  } from 'chart.js';
  import RecordingGraphPointData from './RecordingGraphPointData.svelte';
  import {
    getRecordingChartDatasets,
    type ChartDataset,
  } from '../../../../lib/ChartDataset';
  import type { RecordingData } from '../../../../lib/domain/RecordingData';
  import { stores } from '../../../../lib/stores/Stores';
  import StaticConfiguration from '../../../../StaticConfiguration';
  import { Feature, hasFeature } from '../../../../lib/FeatureToggles';
  import RecordingInspector from '../../3d-inspector/RecordingInspector.svelte';

  export let recording: RecordingData;
  // Option to show y-axis ticks in the chart (default: off)
  export let showYAxisTicks: boolean = false;
  const samples = recording.samples;
  const labels = recording.labels;

  let verticalLineX = NaN;
  let hoverIndex = NaN;
  let modalPosition = { x: 0, y: 0 };
  let modalSize = 250;

  const highlightedAxis = stores.getHighlightedAxes();

  const verticalLineCol = 'black';
  const verticalLineWidth = 1;

  const getDataByIndex = (index: number) => {
    if (isNaN(index)) {
      return [];
    }
    return samples[index].vector;
  };

  let htmlElement: HTMLDivElement;
  const inspectorMarginPx = 5;

  function recomputeModalParams() {
    const rect = htmlElement.getBoundingClientRect();
    modalSize = generateSizeOfInspector(rect);
    modalPosition = generatePositionOfInspector(rect, modalSize);
  }

  /**
   * Positions in regards to size of modal following these rules:
   * - It prefers center-aligning with element in focus (The recording). Moves into view if circle
   * escapes the left or right side.
   * - It prefers showing downwards. Changes to upwards if downwards is not possible.
   * - It always positions at an offset from the element in focus.
   */
  function generatePositionOfInspector(
    rect: DOMRect,
    size: number,
  ): { x: number; y: number } {
    const rectCenterX = (rect.left + rect.right) / 2;

    let x = rectCenterX - size / 2;
    x = Math.max(0, x);
    x = Math.min(x, window.innerWidth - size);

    const showAboveGraph = window.innerHeight - rect.bottom - 15 < size;
    const y = showAboveGraph
      ? rect.top - inspectorMarginPx - size
      : rect.bottom + inspectorMarginPx;

    return { x, y };
  }
  const getLineColor = (axisIndex: number) => {
    if ($highlightedAxis.find(e => e.index === axisIndex) != undefined) {
      return StaticConfiguration.graphColors[axisIndex] + 'ff';
    }
    return StaticConfiguration.graphColors[axisIndex] + '00';
  };

  const generateSizeOfInspector = (rect: DOMRect): number => {
    return (window.innerHeight - rect.height) / 2 - inspectorMarginPx;
  };

  function getConfig(): ChartConfiguration<
    keyof ChartTypeRegistry,
    { x: number; y: number }[],
    string
  > {
    const datasets: ChartDataset[] = getRecordingChartDatasets(samples);

    return {
      type: 'line',
      data: {
        datasets: datasets.map((dataset, idx) => ({
          label: labels[idx],
          borderColor: getLineColor(idx),
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          data: dataset,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: datasets[0].length,
            grid: {
              color: '#f3f3f3',
            },
            ticks: {
              display: false, //this will remove only the label
            },
          },
          y: {
            type: 'linear',
            min: -5.5,
            max: 6.5,
            grid: {
              color: '#f3f3f3',
            },
            ticks: {
              display: showYAxisTicks, // controlled by prop, default false
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      },
      plugins: [
        {
          id: 'mouseLine',
          afterEvent: (chart, args) => {
            if (!args.inChartArea || args.event.type === 'mouseout') {
              verticalLineX = NaN;
              hoverIndex = NaN;
              return;
            }
            verticalLineX = args.event.x ?? NaN;
            if (args.event.native != null) {
              // only recompute modal params if modal is closed (i.e. this event opens the modal)
              if (isNaN(hoverIndex)) {
                recomputeModalParams();
              }
              hoverIndex = chart.getElementsAtEventForMode(
                args.event.native,
                'nearest',
                {},
                true,
              )[0].index;
            } else {
              hoverIndex = NaN;
            }
          },
          afterDraw: function (chart) {
            var ctx = chart.ctx;
            var chartArea = chart.chartArea;

            if (!isNaN(verticalLineX)) {
              ctx.save();
              ctx.strokeStyle = verticalLineCol;
              ctx.lineWidth = verticalLineWidth;
              let path = new Path2D();
              path.moveTo(verticalLineX, chartArea.bottom - 10);
              path.lineTo(verticalLineX, chartArea.top);
              ctx.stroke(path);
              ctx.restore();
            }
          },
        },
      ],
    };
  }

  let canvas: HTMLCanvasElement | undefined;
  let chart: Chart | undefined;

  const unsubscribe = highlightedAxis.subscribe(() => {
    if (chart) {
      chart.destroy();
      const context = canvas?.getContext('2d')!;
      try {
        chart = new Chart(context, getConfig());
      } catch (_) {
        /* Throws an error, but we will ignore it. Due to canvas/context null, but it works fine either way*/
      }
    }
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });

  onMount(() => {
    Chart.unregister(...registerables);
    Chart.register([LinearScale, LineController, PointElement, LineElement]);
    const context = canvas?.getContext('2d')!;
    chart = new Chart(context, getConfig());
    return () => {
      unsubscribe();
    };
  });
</script>

<div bind:this={htmlElement} class="h-full w-full relative">
  <div class="z-1 h-full w-full absolute">
    {#if !isNaN(hoverIndex)}
      {#if hasFeature(Feature.RECORDING_SCRUBBER_VALUES)}
        <RecordingGraphPointData
          offest={verticalLineX}
          sample={getDataByIndex(hoverIndex)} />
      {/if}

      <p
        style="margin-left: {verticalLineX - 20}px; pointer-events:none;"
        class="absolute mt-20 w-10 text-center">
        {hoverIndex}
      </p>
    {/if}

    <canvas bind:this={canvas} />
  </div>
  <!-- For 3D view -->
  <RecordingInspector
    sample={getDataByIndex(hoverIndex)}
    position={modalPosition}
    isOpen={!isNaN(hoverIndex)}
    size={modalSize} />
</div>

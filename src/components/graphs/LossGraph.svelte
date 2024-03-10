<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import {
    Chart,
    ChartConfiguration,
    ChartTypeRegistry,
    LineController,
    LineElement,
    LinearScale,
    LogarithmicScale,
    PointElement,
    Title,
    registerables,
  } from 'chart.js';
  import { t } from '../../i18n';

  import { onMount } from 'svelte';
  import { Readable } from 'svelte/store';
  import { LossTrainingIteration } from './LossGraphUtil';

  export let loss: Readable<LossTrainingIteration[]>;
  export let maxX: number | undefined = undefined;

  function getConfig(
    data: { x: number; y: number }[],
  ): ChartConfiguration<keyof ChartTypeRegistry, { x: number; y: number }[], string> {
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
            data: data,
          },
        ],
      },
      options: {
        //responsive: true,
        //responsive: false,
        plugins: {
          title: {
            display: true,
            text: $t('content.trianer.lossGraph.title'),
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
        animation: false,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: maxX ? maxX : data.length,
            grid: {
              color: '#f3f3f3',
            },
            ticks: {
              display: true,
            },
          },
          y: {
            type: 'logarithmic',
            min: 0,
            max: 1,
            grid: {
              color: '#f3f3f3',
            },
            ticks: {
              display: true,
            },
          },
        },
      },
    };
  }

  $: {
    const data: { x: number; y: number }[] = $loss.map(loss => {
      return { x: loss.epoch, y: loss.loss };
    });
    drawChart(data);
  }

  let canvas: HTMLCanvasElement | undefined;
  let chart: Chart | undefined;

  const drawChart = (data: { x: number; y: number }[]) => {
    if (!canvas) {
      return undefined;
    }
    // if it has already been drawn, then destroy it first to redraw it
    if (chart) {
      chart.destroy();
    }
    Chart.unregister(...registerables);
    Chart.register([
      LinearScale,
      LogarithmicScale,
      LineController,
      PointElement,
      LineElement,
      Title,
    ]);
    chart = new Chart(
      canvas.getContext('2d') ?? new HTMLCanvasElement(),
      getConfig(data),
    );
    chart.ctx.save();

    return chart;
  };

  onMount(() => {
    const data: { x: number; y: number }[] = $loss.map(loss => {
      return { x: loss.epoch, y: loss.loss };
    });
    chart = drawChart(data);

    return () => {
      chart!.destroy();
    };
  });
</script>

<div class="h-60">
  <canvas bind:this={canvas} />
</div>

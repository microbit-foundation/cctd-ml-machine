<script lang="ts">
	import { onMount } from "svelte";
	import { Chart, LinearScale, LineController, PointElement, LineElement, type ChartConfiguration } from "chart.js"


	export let config: ChartConfiguration;

	let chart: Chart;
	let canvas: HTMLCanvasElement;
	onMount(() => {
		Chart.register([LinearScale, LineController, PointElement, LineElement])
		chart = new Chart(canvas.getContext("2d") ?? new HTMLCanvasElement(), config);
	});
</script>

<canvas bind:this={canvas} id="myChart" />

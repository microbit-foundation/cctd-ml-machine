<script lang="ts">
  import { onMount } from 'svelte';
  import KNNModelGraphController from './KNNModelGraphController';

  let svg: SVGElement;

  onMount(() => {
    const controller = new KNNModelGraphController(svg);
  });
</script>

<svg bind:this={svg} id="here" class="d3-3d" width="300" height="300" />

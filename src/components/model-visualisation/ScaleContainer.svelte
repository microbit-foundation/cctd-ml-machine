<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  /**
   * A container which will scale in accordance to the provided variables
   * This ensures that the contents within are scaled in accordance to screen
   * The current version is not very great. Sometimes 'resize' events don't fire
   * This is the case when developer-tab is enabled/disabled. It is also the case
   * that it scale a bit too much.
   */

  export let ratio: number;
  export let contentWidth: number; // large is the content currently.
  export let offsetWidth: number; // Some arbitrary offset may be added for aesthetics purposes.
  $: contentHeight = contentWidth / ratio;
  let element: HTMLDivElement;
  let scaling = 1;

  onMount(() => {
    window.addEventListener("resize", calculateSize);
    calculateSize();
  });
  onDestroy(() => {
    window.removeEventListener("resize", calculateSize);
  });

  function calculateSize() {
    const yScale = element.clientHeight / contentHeight;
    const xScale = (element.clientWidth - offsetWidth) / contentWidth;
    scaling = Math.min(xScale, yScale);
  }
</script>

<div
  bind:this={element}
  class="w-full h-full"
  style="transform: scale({scaling})"
>
  <slot />
</div>

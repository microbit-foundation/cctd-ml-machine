<script lang="ts">
  import type { IllustratedModelOffset } from "../utility/modelVisualisation";

  export let offset: IllustratedModelOffset;
</script>

<!-- A container that allows for the whole model to be offset slightly to make it seem more organic -->
<div
  class="relative h-100 w-150 ease duration-750 animate-zoom-in animate-duration-400"
  style="transform: translate({offset.x}px,{offset.y}px) rotate({offset.rotation}deg);"
>
  <slot />
</div>

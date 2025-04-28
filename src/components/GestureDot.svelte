<script lang="ts">
  import type Gesture from '../script/domain/stores/gesture/Gesture';

  let isDotHovered = false;
  export let gesture: Gesture;

  $: name = $gesture.name;
  $: color = $gesture.color;
</script>

<div
  class="absolute border-1 border-secondary rounded-md shadow-md bg-white top-[-24px]"
  class:hidden={!isDotHovered}>
  <p>{name}</p>
</div>
<div
  on:mouseenter={() => (isDotHovered = true)}
  on:mouseleave={() => (isDotHovered = false)}
  class="w-3 h-3 z-2 rounded-full"
  style="background-color: {color};" />

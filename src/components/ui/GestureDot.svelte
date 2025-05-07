<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import type Gesture from '../../lib/domain/stores/gesture/Gesture';

  let isDotHovered = false;
  export let gesture: Gesture;

  $: name = $gesture.name;
  $: color = $gesture.color;
</script>

<div
  class="absolute border-1 border-secondary rounded-md shadow-md bg-white top-[-28px]"
  class:hidden={!isDotHovered}>
  <p class="px-2">{name}</p>
</div>
<div
  on:mouseenter={() => (isDotHovered = true)}
  on:mouseleave={() => (isDotHovered = false)}
  class="w-3 h-3 z-2 rounded-full"
  style="background-color: {color};" />

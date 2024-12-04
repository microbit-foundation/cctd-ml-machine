<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  export let title = '';
  let isHovered = false;
  let x: number;
  let y: number;

  const mouseOver: MouseEventHandler<HTMLDivElement> = event => {
    isHovered = true;
    x = event.pageX - 280;
    y = event.pageY + 5;
  };

  const mouseMove: MouseEventHandler<HTMLDivElement> = event => {
    x = event.pageX - 280;
    y = event.pageY + 5;
  };
  const mouseLeave: MouseEventHandler<HTMLDivElement> = event => {
    isHovered = false;
  };
</script>

<div
  on:focus={() => {}}
  on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
  on:mousemove={mouseMove}>
  <slot />
</div>

{#if isHovered && !!title}
  <div
    style="top: {y}px; left: {x}px;"
    class="absolute p-1 rounded-sm bg-white shadow-md border-1 border-solid">
    {title}
  </div>
{/if}

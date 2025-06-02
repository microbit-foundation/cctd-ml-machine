<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  export let title = '';
  export let offset: { x: number; y: number } = { x: 0, y: 0 };
  export let disabled: boolean = false;
  let isHovered = false;

  const mouseOver: MouseEventHandler<HTMLDivElement> = event => {
    isHovered = true;
  };

  const mouseLeave: MouseEventHandler<HTMLDivElement> = event => {
    isHovered = false;
  };
</script>

<div on:focus={() => {}} on:mouseover={mouseOver} on:mouseleave={mouseLeave}>
  <slot />
</div>

<!-- TODO: It would be easier to manage if this component was located at the bottom of the DOM. Then we could use a more precise pixel calculation, but for now use the offset responsibly -->
{#if !disabled}
  {#if isHovered && !!title}
    <div
      style="top: {offset.y}px; left: {offset.x}px;"
      class="absolute p-1 rounded-sm bg-white shadow-md border-1 border-solid">
      {title}
    </div>
  {/if}
{/if}

<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
    import { stores } from "../../../lib/stores/Stores";
    import { onDestroy } from "svelte";

  export let fingerprint: number[];
  export let title: string;
  export let filterLabels: string[];

  // Tooltip state
  let tooltipVisible = false;
  let tooltipLabel = "";
  let tooltipIndex = 0;
  let tooltipValue = 0;
  let containerElement: HTMLDivElement;
  let tooltipX = 0;
  let tooltipXOffset = -80;
  let tooltipY = 0;
  let tooltipYOffset = -60;
  let tooltipInterval: NodeJS.Timeout | null = null;

  // Function to convert value (0-1) to viridis-like color
  const getViridisColor = (value: number): string => {
    // Clamp value between 0 and 1
    const t = Math.max(0, Math.min(1, value));

    // Viridis color interpolation (simplified)
    const colors = [
      [68, 1, 84], // Dark purple
      [59, 82, 139], // Blue-purple
      [33, 144, 140], // Teal
      [94, 201, 98], // Green
      [253, 231, 37], // Yellow
    ];

    const scaledT = t * (colors.length - 1);
    const index = Math.floor(scaledT);
    const fraction = scaledT - index;

    if (index >= colors.length - 1) {
      const [r, g, b] = colors[colors.length - 1];
      return `rgb(${r}, ${g}, ${b})`;
    }

    const [r1, g1, b1] = colors[index];
    const [r2, g2, b2] = colors[index + 1];

    const r = Math.round(r1 + (r2 - r1) * fraction);
    const g = Math.round(g1 + (g2 - g1) * fraction);
    const b = Math.round(b1 + (b2 - b1) * fraction);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Tooltip handlers
  const showTooltip = (index: number, value: number) => {
    tooltipLabel = filterLabels[index] || `Cell ${index}`;
    tooltipIndex = index;
    tooltipValue = value;
    
    // Calculate fixed position relative to the visualization container
    if (containerElement) {
      const rect = containerElement.getBoundingClientRect();
      tooltipX = rect.right + tooltipXOffset; // Position near the right edge of the container
      tooltipY = rect.top + tooltipYOffset; // Position near the top of the container
    }
    
    tooltipVisible = true;
    
    // Start polling the value every 200ms
    if (tooltipInterval) {
      clearInterval(tooltipInterval);
    }
    tooltipInterval = setInterval(() => {
      if (tooltipVisible && fingerprint[tooltipIndex] !== undefined) {
        tooltipValue = fingerprint[tooltipIndex];
      }
    }, 200);
  };

  const hideTooltip = () => {
    tooltipVisible = false;
    
    // Clear the polling interval
    if (tooltipInterval) {
      clearInterval(tooltipInterval);
      tooltipInterval = null;
    }
  };

  // Cleanup on component destroy
  onDestroy(() => {
    if (tooltipInterval) {
      clearInterval(tooltipInterval);
    }
  });
</script>

<div class="flex flex-col font-sans w-full h-full" bind:this={containerElement}>
  <div class="flex flex-col border border-gray-300 flex-1">
    {#each fingerprint as value, index}
        <div
          class="border-b border-white border-opacity-10 transition-opacity duration-200 hover:opacity-80 cursor-pointer last:border-b-0 flex-1"
          style="background-color: {getViridisColor(value)};"
          on:mouseenter={() => showTooltip(index, value)}
          on:mouseleave={hideTooltip}
          on:click|stopPropagation
          role="button"
          tabindex="0"/>
    {/each}
  </div>
</div>

<!-- Fixed tooltip positioned globally but relative to the visualization -->
{#if tooltipVisible}
  <div 
    class="fixed bg-white shadow-md text-primarytext text-sm px-3 py-2 rounded z-50 pointer-events-none whitespace-nowrap"
    style="left: {tooltipX}px; top: {tooltipY}px;">
    <div class="font-semibold">{tooltipLabel}</div>
    <div>Value: {tooltipValue.toFixed(3)}</div>
  </div>
{/if}

<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fade } from 'svelte/transition';
  let isExpanded = false;
  const toggleExpanded = () => {
    isExpanded = !isExpanded;
  };
</script>

<div class="flex flex-row items-center justify-center">
  <div class="w-4 ml-2 flex justify-center mr-3">
    <i
      class="fa text-xl cursor-pointer"
      class:fa-times={isExpanded}
      class:fa-bars={!isExpanded}
      on:click={toggleExpanded} />
  </div>
  {#if isExpanded}
    <span class="flex flex-row" transition:fade>
      <slot />
    </span>
  {/if}
</div>

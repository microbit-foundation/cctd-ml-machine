<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { slide } from 'svelte/transition';

  export let heightMax: string;
  export let heightMin: string;
  export let isOpen: boolean;
  export let onOpen: () => void;
  export let onClose: () => void;
  export let style: string = '';
  export let className: string = '';

  const handleClick = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };
  // TODO: In order to support smaller sizes, we have to make a condition that checks the minHeight. If it's too small an icon outside the container must be accessible to reopen it.
</script>

<div
  class="w-full relative overflow-hidden {className ?? ''}"
  style="height: {isOpen ? heightMax : heightMin}; transition: height 0.3s ease; {style ??
    ''}">
  <div
    class="absolute left-0 top-1 h-5 w-5 rounded-full bg-gray-200 flex flex-row justify-center items-center m-1 cursor-pointer"
    on:click={handleClick}>
    <div
      class:fa-angle-down={isOpen}
      class:fa-angle-up={!isOpen}
      class="fa text-lg text-gray-500" />
  </div>
  <slot />
  {#if isOpen}
    <div out:slide={{ duration: 300, delay: 150 }} class="w-full h-full">
      <slot name="open" />
    </div>
  {:else}
    <div class="w-full h-full">
      <slot name="closed" />
    </div>
  {/if}
</div>

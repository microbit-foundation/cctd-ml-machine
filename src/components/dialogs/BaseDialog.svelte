<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fly } from 'svelte/transition';

  export let isOpen: boolean;
  export let onClose: () => void;

  let additionalClass: string;

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  }

  export let backgroundClass: 'light' | 'dark' = 'dark';

  if (backgroundClass === 'light') {
    additionalClass = ' bg-white/80 bg-blend-lighten';
    console.log('hi');
  } else {
    additionalClass = 'bg-black/50 bg-blend-darken';
  }
</script>

<svelte:window on:keydown={handleKeyPress} />

{#if isOpen}
  <div
    transition:fly
    class="
      z-10000
      fixed
      top-0
      left-0
      h-screen
      w-screen
      flex
      justify-center
      items-center
      {additionalClass}
    "
    on:click={onClose}>
    <slot />
  </div>
{/if}

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fly } from 'svelte/transition';

  export let isOpen: boolean;
  export let onClose: () => void;

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
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
      bg-black/50
      bg-blend-darken
      h-screen
      w-screen
      flex
      justify-center
      items-center
    "
    on:click={onClose}>
    <slot />
  </div>
{/if}

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import BaseDialog from './BaseDialog.svelte';

  export let hasCloseButton = true;
  export let isOpen: boolean;
  export let onClose: () => void;
</script>

<BaseDialog {isOpen} {onClose}>
  <div
    class="w-min h-min border-gray-200 border border-solid relative bg-white rounded-lg p-8"
    on:click|stopPropagation>
    {#if hasCloseButton}
      <div class="absolute right-2 top-2 svelte-1rnkjvh">
        <button
          class="hover:bg-gray-100 rounded outline-transparent w-8 svelte-1rnkjvh"
          on:click={onClose}>
          <i
            class="fas fa-plus text-lg text-gray-600 hover:text-gray-800 duration-75 svelte-1rnkjvh"
            style="transform: rotate(45deg);" />
        </button>
      </div>
    {/if}
    <div class="m-1 {hasCloseButton ? 'mt-3' : 'mt-1'}">
      <slot />
    </div>
  </div>
</BaseDialog>

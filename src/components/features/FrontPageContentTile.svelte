<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { type ComponentType } from 'svelte';

  export let contentComponent: ComponentType;
  export let fillColumns: number = 1;
</script>

<div
  class="border-gray-200 border border-solid bg-white rounded-lg p-6 shadow-xl {'col-span-' +
    fillColumns}">
  <svelte:component this={contentComponent} />
</div>

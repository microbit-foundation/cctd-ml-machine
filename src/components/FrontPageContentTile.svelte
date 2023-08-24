<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { SvelteComponent } from 'svelte';

  export let contentComponent: SvelteComponent;
</script>

<div class="border-gray-200 border border-solid bg-white rounded-lg p-6 shadow-xl">
  <svelte:component this={contentComponent} />
</div>

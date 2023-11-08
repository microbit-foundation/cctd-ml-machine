<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<style>
  .grid-container {
    display: grid;
    gap: 1rem 1rem;
    grid-template-areas:
      'a b'
      'a c';
  }
</style>

<script lang="ts">
  import FrontPageContentTile from '../components/FrontPageContentTile.svelte';
  import { state } from '../script/stores/uiStore';
</script>

<main class="h-full flex flex-col">
  <div class:hidden={$state.isLoading}>
    <div class="grid-container grid-cols-3 min-w-800px p-10 pb-2 pt-2 mt-3">
      <FrontPageContentTile>Input data</FrontPageContentTile>
      <FrontPageContentTile>Train model</FrontPageContentTile>
      <FrontPageContentTile>Test model</FrontPageContentTile>
    </div>
  </div>
</main>

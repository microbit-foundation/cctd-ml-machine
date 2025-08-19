<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import LiveDataSynthesizer from '../components/features/playground/inputSynthesizer/LiveDataSynthesizer.svelte';
  import PlaygroundLog from '../components/features/playground/PlaygroundLog.svelte';
  import StoresDisplay from '../components/features/playground/StoresDisplay.svelte';

  let isPlaygroundActive = false;
  onMount(() => {
    isPlaygroundActive = true;
  });
</script>

{#if isPlaygroundActive}
  <div class="flex flex-col p-5">
    <div class="flex">
      <StoresDisplay />
      <div class="flex-grow" />
      <div class="flex flex-col w-100">
        <PlaygroundLog />
      </div>
    </div>
    <LiveDataSynthesizer />
  </div>
{/if}

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fade } from 'svelte/transition';
  import RecordingGraph from './graphs/recording/RecordingGraph.svelte';
  import type { RecordingData } from '../script/domain/RecordingData';
    import { onMount } from 'svelte';

  // get recording from mother prop
  export let recording: RecordingData;
  export let onDelete: (recording: RecordingData) => void;

  let hide = false;

  // Method for propagating deletion of recording
  function deleteClicked() {
    if (hide) {
      return;
    }

    hide = true;
    setTimeout(() => {
      hide = false;
      onDelete(recording);
    }, 450);
  }
  
</script>

<div class="h-26 w-40 pr-3 pt-1 bg-white relative">
  {#if hide}
    <div transition:fade class="absolute h-26 w-40 bg-white" />
  {:else}
    <div transition:fade class="absolute h-26 w-40 bg-white">
      <RecordingGraph {recording} />
    </div>
  {/if}
  <button class="absolute -left-2.8px top-0px outline-none">
    <div class="relative">
      <i class="z-1 absolute fas fa-circle fa-lg text-white" />
      <i
        class="z-2 absolute far fa-times-circle fa-lg transition
									ease cursor-pointer text-light-800 hover:text-black"
        on:click={deleteClicked} />
    </div>
  </button>
</div>

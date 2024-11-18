<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import { stores } from '../../script/stores/Stores';
  import LiveGraph from './LiveGraph.svelte';

  const highlightedAxes = stores.getHighlightedAxes();
  export let width: number;
</script>

{#if $highlightedAxes.length === 3}
  {#key $highlightedAxes}
    <LiveGraph
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      liveData={$stores.liveData}
      {width} />
  {/key}
{:else}
  <LiveGraph
    minValue={StaticConfiguration.liveGraphValueBounds.min}
    maxValue={StaticConfiguration.liveGraphValueBounds.max}
    liveData={$stores.liveData}
    {width} />
{/if}

<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { stores } from '../../../lib/stores/Stores';
  import StaticConfiguration from '../../../StaticConfiguration';
  import LiveGraph from './LiveGraph.svelte';

  const highlightedAxes = stores.getHighlightedAxes();
  export let width: number;
</script>

{#if $stores.liveData !== undefined}
  {#key $highlightedAxes.map(e => `${e.index}`).join('-')}
    <LiveGraph
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      liveData={$stores.liveData}
      {width} />
  {/key}
{/if}

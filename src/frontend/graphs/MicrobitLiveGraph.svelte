<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import StaticConfiguration from '../../StaticConfiguration';
  import LiveGraph from './LiveGraph.svelte';

  const liveData = getControllers().getDataController().getLiveData();
  const highlightedAxes = getControllers().getAxisController().getSelectedAxes();
  export let width: number;
</script>

{#if $liveData !== undefined}
  {#key $highlightedAxes.map(e => `${e.index}`).join('-')}
    <LiveGraph
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      {liveData}
      {width} />
  {/key}
{/if}

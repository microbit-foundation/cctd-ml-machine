<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import { stores } from '../../script/stores/Stores';
  import LiveGraph from './LiveGraph.svelte';

  const highlightedAxes = stores.getHighlightedAxes();
  const availableAxes = stores.getAvailableAxes();
  export let width: number;
  $: graphKey = $highlightedAxes.map(e => `${e.index}`).join('-');
  console.log($availableAxes);
  console.log('hi', $highlightedAxes);
  $: console.log('gk', graphKey);
</script>

{#key $highlightedAxes.map(e => `${e.index}`).join('-')}
  <LiveGraph
    minValue={StaticConfiguration.liveGraphValueBounds.min}
    maxValue={StaticConfiguration.liveGraphValueBounds.max}
    liveData={$stores.liveData}
    {width} />
{/key}

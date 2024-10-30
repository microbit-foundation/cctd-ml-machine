<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import { stores } from '../../script/stores/Stores';
  import LiveGraph from './LiveGraph.svelte';

  const highlightedAxis = stores.getHighlightedAxis();
  export let width: number;
  $: showhighlit = hasFeature(Feature.KNN_MODEL) && $highlightedAxis !== undefined;
  console.log(hasFeature(Feature.KNN_MODEL) && $highlightedAxis !== undefined);
</script>

{#if showhighlit}
  {#key $highlightedAxis}
    <LiveGraph
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      liveData={$stores.liveData}
      highlightVectorIndex={$highlightedAxis}
      {width} />
  {/key}
{:else}
  <LiveGraph
    minValue={StaticConfiguration.liveGraphValueBounds.min}
    maxValue={StaticConfiguration.liveGraphValueBounds.max}
    liveData={$stores.liveData}
    {width} />
{/if}

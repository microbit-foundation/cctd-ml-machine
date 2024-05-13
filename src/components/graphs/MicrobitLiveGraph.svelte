<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import Axes from '../../script/domain/Axes';
  import { stores } from '../../script/stores/Stores';
  import { highlightedAxis } from '../../script/stores/uiStore';
  import LiveGraph from './LiveGraph.svelte';
  import LiveGraphHighlighted from './LiveGraphHighlighted.svelte';

  //axis={Axes.X}
  export let width: number;
  $: showhighlit = hasFeature(Feature.KNN_MODEL) && $highlightedAxis !== undefined;
  console.log(hasFeature(Feature.KNN_MODEL) && $highlightedAxis !== undefined);
  $: highlightedVectorIndex =
    $highlightedAxis === Axes.X ? 0 : $highlightedAxis === Axes.Y ? 1 : 2;
</script>

{#if showhighlit}
  {#key highlightedVectorIndex}
    <LiveGraph
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      liveData={$stores.liveData}
      highlightVectorIndex={highlightedVectorIndex}
      {width} />
  {/key}
{:else}
  <LiveGraph
    minValue={StaticConfiguration.liveGraphValueBounds.min}
    maxValue={StaticConfiguration.liveGraphValueBounds.max}
    liveData={$stores.liveData}
    {width} />
{/if}

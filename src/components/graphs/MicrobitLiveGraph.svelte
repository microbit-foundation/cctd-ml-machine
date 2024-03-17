<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import Axes from '../../script/domain/Axes';
  import { liveAccelerometerData } from '../../script/stores/Stores';
  import { highlightedAxis } from '../../script/stores/uiStore';
  import LiveGraph from './LiveGraph.svelte';
  import LiveGraphHighlighted from './LiveGraphHighlighted.svelte';

  export let width: number;

  $: showhighlit = hasFeature(Feature.KNN_MODEL) && $highlightedAxis !== undefined;
</script>

{#if showhighlit}
  {#if $highlightedAxis === Axes.X}
    <LiveGraphHighlighted
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      liveData={liveAccelerometerData}
      axis={Axes.X}
      {width} />
  {/if}
  {#if $highlightedAxis === Axes.Y}
    <LiveGraphHighlighted
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      liveData={liveAccelerometerData}
      axis={Axes.Y}
      {width} />
  {/if}
  {#if $highlightedAxis === Axes.Z}
    <LiveGraphHighlighted
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      liveData={liveAccelerometerData}
      axis={Axes.Z}
      {width} />
  {/if}
{:else}
  <LiveGraph
    minValue={StaticConfiguration.liveGraphValueBounds.min}
    maxValue={StaticConfiguration.liveGraphValueBounds.max}
    liveData={liveAccelerometerData}
    {width} />
{/if}

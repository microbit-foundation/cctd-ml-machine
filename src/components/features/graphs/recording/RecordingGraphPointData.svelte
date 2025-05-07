<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { derived } from 'svelte/store';
  import { stores } from '../../../../lib/stores/Stores';
  import StaticConfiguration from '../../../../StaticConfiguration';
  import FixedNumber from '../../../ui/FixedNumber.svelte';

  export let sample: number[];
  export let offest: number;
  const highlightedAxes = stores.getHighlightedAxes();

  const sampleEnabled = derived(highlightedAxes, axes => {
    return sample.map((_, idx) => axes.find(axis => axis.index === idx) !== undefined);
  });

  $: noOfHighlightedAxes = $highlightedAxes.length;
</script>

<p
  style="left: calc({offest}px - {42 *
    noOfHighlightedAxes}px); top:-25px ;pointer-events:none"
  class="absolute w-40">
  <span>
    {#each sample as sampleValue, idx}
      {#if $sampleEnabled[idx]}
        <span class="mr-1" style="color: {StaticConfiguration.graphColors[idx]};">
          <FixedNumber digits={2} number={sampleValue} />
        </span>
      {/if}
    {/each}
  </span>
</p>

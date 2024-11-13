<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { derived } from 'svelte/store';
  import SmoothedLiveData from '../../script/livedata/SmoothedLiveData';
  import type { Axis } from '../../script/stores/Axis';
  import { stores } from '../../script/stores/Stores';
  import StaticConfiguration from '../../StaticConfiguration';
  import FixedNumber from '../base/FixedNumber.svelte';

  const highlightedAxes = stores.getHighlightedAxes();
  const availableAxes = stores.getAvailableAxes();

  const clickNumber = (axis: Axis) => {
    highlightedAxes.toggleAxis(axis);
  };

  $: liveData = new SmoothedLiveData($stores.liveData, 3);
  $: input = $liveData.getVector();
  $: axes = derived([highlightedAxes, availableAxes], stores => {
    const highlighted = stores[0];
    return stores[1].map(e => ({
      isHighlighted: !!highlighted.find(l => l.index === e.index),
      ...e,
    }));
  });
</script>

<div class="flex flex-row w-50 mt-[2px] gap-2">
  {#each $axes as axis}
    <div class="min-w-16 max-w-16 text-sm">
      <p
        on:click={() => clickNumber(axis)}
        class="w-full whitespace-nowrap cursor-pointer select-none hover:border-solid hover:border-secondary px-1 border-1 rounded-md"
        class:border-secondary={axis.isHighlighted}
        class:font-bold={axis.isHighlighted}
        style="color:{StaticConfiguration.graphColors[axis.index]}">
        {axis.label}: <FixedNumber digits={2} number={input[axis.index]} />
      </p>
    </div>
  {/each}
</div>

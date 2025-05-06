<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { derived } from 'svelte/store';
  import { stores } from '../../../lib/stores/Stores';
  import StaticConfiguration from '../../../StaticConfiguration';
  import type { Axis } from '../../../lib/domain/Axis';
  import FixedNumber from '../../base/FixedNumber.svelte';
  import SmoothedLiveData from '../../../lib/livedata/SmoothedLiveData';

  const highlightedAxes = stores.getHighlightedAxes();
  const availableAxes = stores.getAvailableAxes();

  const clickNumber = (axis: Axis) => {
    highlightedAxes.toggleAxis(axis);
  };

  $: liveData = $stores.liveData ? new SmoothedLiveData($stores.liveData, 3) : undefined;
  $: input = $liveData ? $liveData.getValue() : undefined;
  $: axes = derived([highlightedAxes, availableAxes], stores => {
    const highlighted = stores[0];
    return stores[1].map(e => ({
      isHighlighted: !!highlighted.find(l => l.index === e.index),
      ...e,
    }));
  });

  const getBackgroundColor = (axis: { isHighlighted: boolean } & Axis) => {
    return `${StaticConfiguration.graphColors[axis.index]}${axis.isHighlighted ? 'ff' : '11'}`;
  };
</script>

<div class="flex flex-row w-50 mt-[2px] gap-2">
  {#each $axes as axis}
    <div class="min-w-18 max-w-18 text-sm">
      <p
        on:click={() => clickNumber(axis)}
        class="w-full font-bold whitespace-nowrap cursor-pointer select-none hover:border-solid hover:border-secondary px-1 border-1 rounded-md"
        class:border-secondary={axis.isHighlighted}
        style="background-color:{getBackgroundColor(axis)}">
        {axis.label}: <FixedNumber digits={2} number={input ? input[axis.index] : 0} />
      </p>
    </div>
  {/each}
</div>

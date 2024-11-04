<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import SmoothedLiveData from '../../script/livedata/SmoothedLiveData';
  import { stores } from '../../script/stores/Stores';
  import StaticConfiguration from '../../StaticConfiguration';
  import FixedNumber from '../base/FixedNumber.svelte';

  const highlightedAxis = stores.getHighlightedAxis();

  const clickNumber = (inputIdx: number) => {
    if ($highlightedAxis === inputIdx) {
      $highlightedAxis = undefined;
    } else {
      $highlightedAxis = inputIdx;
    }
  };

  $: liveData = new SmoothedLiveData($stores.liveData, 3);
  $: input = $liveData.getVector();
  $: labels = $liveData.getLabels();
</script>

<div class="flex flex-row w-50 mt-[2px] justify-between">
  {#each input as inputValue, i}
    <div class="w-18 text-sm">
      <p
        on:click={() => clickNumber(i)}
        class="whitespace-nowrap cursor-pointer select-none hover:border-solid hover:border-secondary px-1 border-1 font-bold rounded-md"
        class:border-secondary={$highlightedAxis === i}
        style="color:{StaticConfiguration.liveGraphColors[i]}">
        {labels[i]}: <FixedNumber digits={2} number={inputValue} />
      </p>
    </div>
  {/each}
</div>

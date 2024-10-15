<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import SmoothedLiveData from '../../script/livedata/SmoothedLiveData';
  import { stores } from '../../script/stores/Stores';
  import StaticConfiguration from '../../StaticConfiguration';

  const liveData = new SmoothedLiveData($stores.liveData, 3);
  $: input = $liveData.getVector();
  $: labels = $liveData.getLabels();
</script>

<div class="flex flex-row w-50 justify-between">
  {#each input as inputValue, i}
    <div class="w-16">
      <p style="color:{StaticConfiguration.liveGraphColors[i]}">
        {labels[i]}: {inputValue.toFixed(2)}
      </p>
    </div>
  {/each}
</div>

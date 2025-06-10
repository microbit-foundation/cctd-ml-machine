<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { stores } from '../../../lib/stores/Stores';
  import NumberSelector from '../../ui/NumberSelector.svelte';

  const knnModelSettings = stores.getKNNModelSettings();
  
  const handleCheckboxEvent = (event: any) => {
    knnModelSettings.setNormalized(event.target.checked);
  };
</script>

<div class="grid gap-1 text-sm gap-x-4 grid-cols-[1fr,1fr]">
  <p class="whitespace-nowrap content-center">Neighbours (K)</p>
  <div class="justify-self-center">
    <NumberSelector
      min={1}
      max={30}
      defaultValue={$knnModelSettings.k}
      onChange={val => knnModelSettings.setK(val)} />
  </div>
  <p class="whitespace-nowrap content-center">Normalize</p>
  <div class="justify-self-center">
    <input
      type="checkbox"
      checked={$knnModelSettings.normalized}
      on:click={handleCheckboxEvent} />
  </div>
</div>

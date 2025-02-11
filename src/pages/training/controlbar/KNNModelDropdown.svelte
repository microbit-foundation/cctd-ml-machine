<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';
  import StandardDropdownButton from '../../../components/buttons/StandardDropdownButton.svelte';
  import NumberSelector from '../../../components/NumberSelector.svelte';
  import ModelRegistry from '../../../script/domain/ModelRegistry';
  import { stores } from '../../../script/stores/Stores';
  import { selectModel } from '../TrainingPage';

  export let isSelected: boolean;
  const knnModelSettings = stores.getKNNModelSettings();
  $: console.log($knnModelSettings.normalized);
  const handleCheckboxEvent = (event: any) => {
    knnModelSettings.setNormalized(event.target.checked);
  };
</script>

<StandardDropdownButton
  onClick={() => {
    selectModel(ModelRegistry.KNN);
  }}
  fillOnHover
  outlined={!isSelected}
  small>
  <p>KNN Model</p>

  <div slot="content" class="py-2">
    <div class="flex flex-col">
      <div class="grid gap-1 gap-x-2 grid-cols-[1fr,1fr]">
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
    </div>
  </div>
</StandardDropdownButton>

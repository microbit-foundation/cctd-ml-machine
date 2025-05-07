<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import Range from '../../../Range.svelte';
  import liveDataSynthesizer from './LiveDataSynthesizer';
  $: values = $liveDataSynthesizer.speeds;
</script>

{#each values as val, index}
  <p>Speed {index}</p>
  <Range
    min={liveDataSynthesizer.getMinSineSpeed()}
    max={liveDataSynthesizer.getMaxSineSpeed()}
    initialValue={liveDataSynthesizer.getInitialSineSpeed() * 1000}
    on:change={e => liveDataSynthesizer.setSpeed(index, e.detail.value)} />
{/each}

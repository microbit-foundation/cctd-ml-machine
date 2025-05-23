<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import Range from '../../../ui/Range.svelte';
  import liveDataSynthesizer from './LiveDataSynthesizer';

  const setNoOfAxes = (number: number) => {
    liveDataSynthesizer.setNoOfAxes(number);
  };
</script>

<p>No of axes ({$liveDataSynthesizer.noOfAxes})</p>
<Range min={1} max={10} initialValue={1} on:change={e => setNoOfAxes(e.detail.value)} />

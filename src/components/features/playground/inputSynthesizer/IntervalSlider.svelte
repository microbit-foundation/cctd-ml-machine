<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script>
  import Range from '../../../ui/Range.svelte';
  import liveDataSynthesizer from './LiveDataSynthesizer';

  const setIntervalValue = newValue => {
    liveDataSynthesizer.setIntervalSpeed(newValue);
  };
</script>

<p>Synthesis interval ({$liveDataSynthesizer.intervalSpeed}), lower is faster</p>
<Range
  min={liveDataSynthesizer.getMinIntervalValue()}
  max={liveDataSynthesizer.getMaxIntervalValue()}
  initialValue={liveDataSynthesizer.getInitialIntervalValue()}
  on:change={e => setIntervalValue(e.detail.value)} />

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script>
  import Range from '../../Range.svelte';
  import accelerometerSynthesizer from './AccelerometerDataSynthesizer';

  const setIntervalValue = newValue => {
    accelerometerSynthesizer.setIntervalSpeed(newValue);
  };
</script>

<p>Synthesis interval ({$accelerometerSynthesizer.intervalSpeed}), lower is faster</p>
<Range
  min={accelerometerSynthesizer.getMinIntervalValue()}
  max={accelerometerSynthesizer.getMaxIntervalValue()}
  initialValue={accelerometerSynthesizer.getInitialIntervalValue()}
  on:change={e => setIntervalValue(e.detail.value)} />

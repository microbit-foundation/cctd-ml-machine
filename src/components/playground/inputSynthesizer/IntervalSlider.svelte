<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script>
  import Slider from '@bulatdashiev/svelte-slider';
  import accelerometerSynthesizer from './AccelerometerDataSynthesizer';

  const minInterval = 5;
  const maxInterval = 300;

  const setIntervalValue = newValue => {
    const interval = ((maxInterval - minInterval) * newValue) / 100 + minInterval;
    accelerometerSynthesizer.setIntervalSpeed(interval);
  };
</script>

<p>Synthesis interval ({$accelerometerSynthesizer.intervalSpeed}), lower is faster</p>
<Slider on:input={e => setIntervalValue(e.detail[0])} />

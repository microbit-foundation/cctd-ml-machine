<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import liveDataSynthesizer from './AccelerometerDataSynthesizer';
  import Range from './../../Range.svelte';
  import { onMount } from 'svelte';

  const initialValues = {
    x: 0,
    y: 0,
    z: 0,
  };

  initialValues.x = $liveDataSynthesizer.xSpeed * 1000;
  initialValues.y = $liveDataSynthesizer.ySpeed * 1000;
  initialValues.z = $liveDataSynthesizer.zSpeed * 1000;
</script>

<p>x Speed (Frequency)</p>
<Range
  min={liveDataSynthesizer.getMinSineSpeed()}
  max={liveDataSynthesizer.getMaxSineSpeed()}
  initialValue={initialValues.x}
  on:change={e => liveDataSynthesizer.setXSpeed(e.detail.value)} />

<p>y Speed (Frequency)</p>
<Range
  min={liveDataSynthesizer.getMinSineSpeed()}
  max={liveDataSynthesizer.getMaxSineSpeed()}
  initialValue={initialValues.y}
  on:change={e => liveDataSynthesizer.setYSpeed(e.detail.value)} />

<p>z Speed (Frequency)</p>
<Range
  min={liveDataSynthesizer.getMinSineSpeed()}
  max={liveDataSynthesizer.getMaxSineSpeed()}
  initialValue={initialValues.z}
  on:change={e => liveDataSynthesizer.setZSpeed(e.detail.value)} />

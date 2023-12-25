<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import accelerometerSynthesizer from './AccelerometerDataSynthesizer';
  import Range from './../../Range.svelte';
  import { onMount } from 'svelte';

  const initialValues = {
    x: 0,
    y: 0,
    z: 0,
  };

  initialValues.x = $accelerometerSynthesizer.xSpeed * 1000;
  initialValues.y = $accelerometerSynthesizer.ySpeed * 1000;
  initialValues.z = $accelerometerSynthesizer.zSpeed * 1000;
</script>

<p>x Speed (Frequency)</p>
<Range
  min={accelerometerSynthesizer.getMinSineSpeed()}
  max={accelerometerSynthesizer.getMaxSineSpeed()}
  initialValue={initialValues.x}
  on:change={e => accelerometerSynthesizer.setXSpeed(e.detail.value)} />

<p>y Speed (Frequency)</p>
<Range
  min={accelerometerSynthesizer.getMinSineSpeed()}
  max={accelerometerSynthesizer.getMaxSineSpeed()}
  initialValue={initialValues.y}
  on:change={e => accelerometerSynthesizer.setYSpeed(e.detail.value)} />

<p>z Speed (Frequency)</p>
<Range
  min={accelerometerSynthesizer.getMinSineSpeed()}
  max={accelerometerSynthesizer.getMaxSineSpeed()}
  initialValue={initialValues.z}
  on:change={e => accelerometerSynthesizer.setZSpeed(e.detail.value)} />

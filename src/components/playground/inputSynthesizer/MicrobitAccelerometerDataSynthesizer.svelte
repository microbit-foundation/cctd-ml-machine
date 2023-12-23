<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script>
  import IntervalSlider from './IntervalSlider.svelte';
  import accelerometerSynthesizer from './AccelerometerDataSynthesizer';
  import { liveAccelerometerData } from '../../../script/stores/Stores';
  import SynthesizerGraph from './SynthesizerGraph.svelte';
    import Range from '../../Range.svelte';
</script>

<div class="flex flex-col">
  <p class="text-lg">Live data synthesizer</p>
  <p class="text-sm">Uses sine-waves to produce LiveData</p>
  <div class="grid grid-cols-2">
    <IntervalSlider />
    
    <p>x Speed (Frequency)</p>
    <Range min={accelerometerSynthesizer.getMinSineSpeed()} 
    max={accelerometerSynthesizer.getMaxSineSpeed()} 
    initialValue={accelerometerSynthesizer.getInitialSineSpeed()} 
    on:change={e => accelerometerSynthesizer.setXSpeed(e.detail.value)} />
    
    <p>y Speed (Frequency)</p>
    <Range min={accelerometerSynthesizer.getMinSineSpeed()} 
    max={accelerometerSynthesizer.getMaxSineSpeed()} 
    initialValue={accelerometerSynthesizer.getInitialSineSpeed()} 
    on:change={e => accelerometerSynthesizer.setYSpeed(e.detail.value)} />
    
    <p>z Speed (Frequency)</p>
    <Range min={accelerometerSynthesizer.getMinSineSpeed()} 
    max={accelerometerSynthesizer.getMaxSineSpeed()} 
    initialValue={accelerometerSynthesizer.getInitialSineSpeed()} 
    on:change={e => accelerometerSynthesizer.setZSpeed(e.detail.value)} />
  </div>
  <SynthesizerGraph
    liveData={liveAccelerometerData}
    minValue={-1.1}
    maxValue={1.1}
    width={850} />
  <p class="whitespace-pre">{JSON.stringify($accelerometerSynthesizer, null, 2)}</p>
</div>

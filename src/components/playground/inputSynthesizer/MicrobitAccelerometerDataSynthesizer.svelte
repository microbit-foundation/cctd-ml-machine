<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script>
  import IntervalSlider from './IntervalSlider.svelte';
  import liveDataSynthesizer from './AccelerometerDataSynthesizer';
  import SynthesizerGraph from './SynthesizerGraph.svelte';
  import SynthesizerToggleButton from './SynthesizerToggleButton.svelte';
  import SpeedSliders from './SpeedSliders.svelte';
  import { stores } from '../../../script/stores/Stores';
</script>

<div class="flex flex-col">
  <p class="text-lg">Live data synthesizer</p>
  <SynthesizerToggleButton />
  <p class="text-sm">Uses sine-waves to produce LiveData</p>
  <div class="grid grid-cols-2">
    <IntervalSlider />

    <SpeedSliders />
  </div>
  <SynthesizerGraph
    liveData={stores.getLiveData()}
    minValue={-1.1}
    maxValue={1.1}
    width={850} />
  <p class="whitespace-pre">{JSON.stringify($liveDataSynthesizer, null, 2)}</p>
</div>

<script>
  import IntervalSlider from './IntervalSlider.svelte';
    import Slider from '@bulatdashiev/svelte-slider';
    import Visualizer from './Visualizer.svelte';
    import accelerometerSynthesizer from './AccelerometerDataSynthesizer';
    import { liveData } from '../../../script/stores/Stores';
    </script>

<div class="flex flex-col">
  <p class="text-lg">Live data synthesizer</p>
  <div class="grid grid-cols-2">
    <IntervalSlider />
    <p>x Speed</p>
    <Slider on:input={e => accelerometerSynthesizer.setXSpeed(e.detail[0])} />
    <p>y Speed</p>
<Slider on:input={e => accelerometerSynthesizer.setYSpeed(e.detail[0])} />
    <p>z Speed</p>
    <Slider on:input={e => accelerometerSynthesizer.setZSpeed(e.detail[0])} />
  </div>
  <Visualizer width={800}/>
  <p class="whitespace-pre">{JSON.stringify($accelerometerSynthesizer, null, 2)}</p>

</div>

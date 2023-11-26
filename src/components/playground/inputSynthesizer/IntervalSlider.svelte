<script>
  import Slider from '@bulatdashiev/svelte-slider';
  import IntervalSlider from './IntervalSlider.svelte';
  import accelerometerSynthesizer from './AccelerometerDataSynthesizer';

  const minInterval = 50;
  const maxInterval = 2000;

  const setIntervalValue = newValue => {
    const interval = ((maxInterval - minInterval) * newValue) / 100 + minInterval;
    accelerometerSynthesizer.setIntervalSpeed(interval);
  };
</script>

<p>Synthesis interval ({$accelerometerSynthesizer.intervalSpeed}), lower is faster</p>
<Slider on:input={e => setIntervalValue(e.detail[0])} />

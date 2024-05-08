<script lang="ts">
  import Range from '../../Range.svelte';
  import liveDataSynthesizer from './LiveDataSynthesizer';

  const setNoOfAxes = (number: number) => {
    liveDataSynthesizer.setNoOfAxes(number);
  };
</script>

<p>No of axes ({$liveDataSynthesizer.noOfAxes})</p>
<Range min={1} max={10} initialValue={1} on:change={e => setNoOfAxes(e.detail.value)} />

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import accelerometerSynthesizer from './AccelerometerDataSynthesizer';

  const toggleSynthesizer = () => {
    if (accelerometerSynthesizer.isActive()) {
      accelerometerSynthesizer.stop();
    } else {
      accelerometerSynthesizer.start();
    }
  };
</script>

<div>
  <button
    class="border-1 border-primary bg-white rounded px-4 py-2"
    on:click={toggleSynthesizer}
    >{$accelerometerSynthesizer.isActive
      ? 'Stop synthesizer'
      : 'Start synthesizer'}</button>
</div>

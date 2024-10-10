<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import liveDataSynthesizer from './LiveDataSynthesizer';

  const toggleSynthesizer = () => {
    if (liveDataSynthesizer.isActive()) {
      liveDataSynthesizer.stop();
    } else {
      liveDataSynthesizer.start();
    }
  };
</script>

<div>
  <button
    class="border-1 border-primary bg-white rounded px-4 py-2"
    on:click={toggleSynthesizer}>
    {$liveDataSynthesizer.isActive ? 'Stop synthesizer' : 'Start synthesizer'}
  </button>
</div>

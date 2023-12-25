<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import PlaygroundLog from '../components/playground/PlaygroundLog.svelte';
  import MicrobitAccelerometerDataSynthesizer from '../components/playground/inputSynthesizer/MicrobitAccelerometerDataSynthesizer.svelte';
  import LiveDataBufferUtilizationPercentage from '../components/playground/LiveDataBufferUtilizationPercentage.svelte';
  import StoresDisplay from '../components/playground/StoresDisplay.svelte';
  import EngineInteractionButtons from '../components/playground/EngineInteractionButtons.svelte';
</script>

<div class="flex flex-col p-5">
  <div class="flex">
    <StoresDisplay />
    <div class="flex-grow" />
    <div class="flex flex-col w-100">
      <EngineInteractionButtons />
      <PlaygroundLog />
    </div>
  </div>
  <MicrobitAccelerometerDataSynthesizer />
  <LiveDataBufferUtilizationPercentage />
</div>

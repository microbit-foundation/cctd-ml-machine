<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { createFrameDriver, createMakeCodeIframe } from './MakeCodeIntegration';

  onMount(async () => {
    const frameElem = document.getElementById('makecode-elem');
    if (!frameElem) {
      return;
    }

    const iframe = createMakeCodeIframe();
    // Create and initialise an instance of MakeCodeFrameDriver.
    const driverRef = createFrameDriver(iframe);
    driverRef.initialize();
    driverRef.hideSimulator();
    frameElem.appendChild(iframe);
  });
</script>

<div id="makecode-elem" class="h-[calc(100%-8px)] w-full bg-blue-500" />

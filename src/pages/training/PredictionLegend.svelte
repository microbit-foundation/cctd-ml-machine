<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
    import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import GestureDot from '../../components/ui/GestureDot.svelte';
  import { stores } from '../../lib/stores/Stores';

  const controllers = getControllers();
  const gestureController = controllers.getGestureController();

  const gestures = gestureController.getGestures();

  const confidences = stores.getConfidences();
  const devices = stores.getDevices();
</script>

{#each $gestures as gesture}
  <div class="flex flex-row justify-between">
    <div class="flex flex-row">
      <div class="flex flex-col justify-center mr-1">
        <GestureDot disableTooltip gestureId={gesture.getID()} />
      </div>
      <p>{gesture.getName()}</p>
    </div>
    {#if $devices.isInputReady}
      <p>
        {(($confidences.get(gesture.getID()) ?? 0) * 100).toFixed(1)}%
      </p>
    {/if}
  </div>
{/each}

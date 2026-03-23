<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import GestureDot from '../../components/ui/GestureDot.svelte';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
  const gestureController = getControllers().getGestureController();
  const gestures = gestureController.getGestures();
  const classifierController = getControllers().getClassifierController();
</script>

{#each $gestures as gesture}
  <div class="flex flex-row justify-between">
    <div class="flex flex-row">
      <div class="flex flex-col justify-center mr-1">
        <GestureDot disableTooltip {gesture} />
      </div>
      <p>{gesture.getName()}</p>
    </div>
    {#if $microbitConnection.getInput().isReady()}
      <p>
        {(
          (classifierController.getGestureConfidence(gesture.getID()) ?? 0) * 100
        ).toFixed(1)}%
      </p>
    {/if}
  </div>
{/each}

<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import GestureDot from '../components/GestureDot.svelte';
  import type { GestureID } from '../../core/entities/NewGesture';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
  export let gestureId: GestureID;
  const gestureController = getControllers().getGestureController();
  const gesture = gestureController.getGestureState(gestureId);

  const classifierController = getControllers().getClassifierController();
  const idx = gestureController.getClassIndex(gestureId);
  const predictions = classifierController.getPrediction();
  $: prediction =
    idx != null && $predictions != null
      ? $predictions.getPrediction().getValue()[idx]
      : 0;
</script>

<div class="flex flex-row justify-between">
  <div class="flex flex-row">
    <div class="flex flex-col justify-center mr-1">
      <GestureDot disableTooltip gesture={$gesture} />
    </div>
    <p>{$gesture.getName()}</p>
  </div>
  {#if $microbitConnection.getInput().isReady()}
    <p>
      {(prediction * 100).toFixed(1)}%
    </p>
  {/if}
</div>

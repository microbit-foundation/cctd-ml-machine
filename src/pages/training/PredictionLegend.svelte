<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import PredictionLegendGesture from './PredictionLegendGesture.svelte';

  const gestureController = getControllers().getGestureController();
  const gestures = gestureController.getGestures();
</script>

{#each $gestures as gesture}
  <PredictionLegendGesture gestureId={gesture.getID()} />
{/each}

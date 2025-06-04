<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import GestureDot from '../../components/ui/GestureDot.svelte';
  import { state } from '../../lib/stores/ApplicationState';
  import { stores } from '../../lib/stores/Stores';

  const gestures = stores.getGestures();
  const confidences = stores.getConfidences();
</script>

{#each $gestures as gesture}
  <div class="flex flex-row justify-between">
    <div class="flex flex-row">
      <div class="flex flex-col justify-center mr-1">
        <GestureDot disableTooltip gesture={gestures.getGesture(gesture.ID)} />
      </div>
      <p>{gesture.name}</p>
    </div>
    {#if $state.isInputReady}
      <p>
        {(($confidences.get(gesture.ID) ?? 0) * 100).toFixed(1)}%
      </p>
    {/if}
  </div>
{/each}

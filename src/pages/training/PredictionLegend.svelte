<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { state, stores } from '../../lib/stores/Stores';

  const gestures = stores.getGestures();
  const confidences = stores.getConfidences();
</script>

{#each $gestures as gesture}
  <div class="flex flex-row justify-between">
    <div class="flex flex-row">
      <div class="flex flex-col justify-center mr-1">
        <div class="rounded-full w-3 h-3" style={'background-color:' + gesture.color} />
      </div>
      <p>{gesture.name}</p>
    </div>
    {#if $state.isInputReady}
      <p>
        {(($confidences.get(gesture.ID) ?? 0) * 100).toFixed(2)}%
      </p>
    {/if}
  </div>
{/each}

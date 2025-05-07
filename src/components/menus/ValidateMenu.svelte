<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { stores } from '../../lib/stores/Stores';

  const accuracy = stores.getValidationResults().getAccuracy();
</script>

<div class="w-full text-center justify-center pt-5 pb-7">
  {#if !isNaN($accuracy)}
    <p class="text-4xl mb-4">{($accuracy * 100).toFixed(1)}%</p>
  {:else}
    <p class="text-4xl mb-4">-</p>
  {/if}
  <p class="text-xl">Accuracy</p>
</div>

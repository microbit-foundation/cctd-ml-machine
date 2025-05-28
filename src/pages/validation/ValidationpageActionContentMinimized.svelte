<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { tr } from '../../i18n';
  import { stores } from '../../lib/stores/Stores';

  const validationResults = stores.getValidationResults();
  const accuracy = validationResults.getAccuracy();
</script>

<div class="flex flex-col w-full h-full justify-center px-8">
  <div class="flex flex-row justify-between">
    <p>Hello world</p>

    <div class="flex flex-row gap-2">
      {#if !isNaN($accuracy)}
        <p>
          {$tr('content.validation.accuracy')}:
        </p>
        <p class="text-center">
          {($accuracy * 100).toFixed(1)} %
        </p>
      {:else}
        {$tr('content.validation.accuracy')}: -
      {/if}
    </div>
  </div>
</div>

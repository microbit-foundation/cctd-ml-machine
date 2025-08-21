<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import Switch from '../../components/ui/Switch.svelte';
  import Tooltip from '../../components/ui/Tooltip.svelte';
  import { tr } from '../../i18n';
  import { stores } from '../../lib/stores/Stores';

  const validationResults = stores.getValidationResults();
  const accuracy = validationResults.getAccuracy();
  const model = stores.getClassifier().getModel();
  const autoUpdate = validationResults.getAutoUpdate();

  const handleEvaluateValidationSets = () => {
    validationResults.evaluateValidationSet();
  };
</script>

<div class="flex flex-col w-full h-full justify-center px-8">
  <div class="flex flex-row justify-between">
    <div class="flex flex-row gap-2 justify-center">
      <p class="text-sm self-center">
        {$tr('content.validation.testButton.autoUpdate')}:
      </p>
      <Switch size="sm" bind:checked={$autoUpdate} />
      <Tooltip
        disabled={$model.isTrained}
        offset={{ x: 230, y: 0 }}
        title={$tr('content.validation.tutorial.trainmodelfirst')}>
        <StandardButton
          tiny
          disabled={!$model.isTrained}
          onClick={handleEvaluateValidationSets}>
          {$tr('content.validation.testButton.test')}
        </StandardButton>
      </Tooltip>
    </div>

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

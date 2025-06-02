<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { stores } from '../../lib/stores/Stores';
  import { writable, type Readable } from 'svelte/store';
  import ValidationMatrix from './ValidationMatrix.svelte';
  import { type ValidationSetMatrix } from './ValidationPage';
  import { tr } from '../../i18n';
  import Tooltip from '../../components/ui/Tooltip.svelte';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';

  const classifier = stores.getClassifier();
  const model = classifier.getModel();
  const validationResults = stores.getValidationResults();
  const accuracy = validationResults.getAccuracy();
  const validationSetMatrix: Readable<ValidationSetMatrix> =
    validationResults.getMatrix();
  const autoUpdate = validationResults.getAutoUpdate();

  const handleEvaluateValidationSets = () => {
    validationResults.evaluateValidationSet();
  };

  const showPercentages = writable(false);
</script>

<div class="bg-white h-full flex flex-row justify-evenly">
  <div class="pl-2 flex flex-col justify-center">
    <div class="flex flex-row gap-2 justify-center">
      <p>
        {$tr('content.validation.testButton.autoUpdate')}:
      </p>
      <input type="checkbox" bind:checked={$autoUpdate} />
    </div>
    <Tooltip
      disabled={$model.isTrained}
      offset={{ x: 30, y: 20 }}
      title={$tr('content.validation.tutorial.trainmodelfirst')}>
      <StandardButton disabled={!$model.isTrained} onClick={handleEvaluateValidationSets}>
        {$tr('content.validation.testButton.test')}
      </StandardButton>
    </Tooltip>
  </div>

  <div class="flex flex-col justify-center text-center">
    <div class="flex">
      <div class="flex gap-2">
        <div class="flex flex-row self-center">
          <p>{$tr('content.validation.percentage')}:</p>
        </div>
        <input type="checkbox" bind:checked={$showPercentages} />
      </div>
      <div class="mx-2 max-h-37 max-w-180 overflow-y-auto">
        <ValidationMatrix
          validationSetMatrix={$validationSetMatrix}
          showPercentages={$showPercentages} />
      </div>
    </div>
  </div>
  <div class="flex flex-col justify-center">
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

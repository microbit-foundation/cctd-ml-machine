<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { stores } from '../../lib/stores/Stores';
  import { derived, writable, type Readable } from 'svelte/store';
  import ValidationMatrix from './ValidationMatrix.svelte';
  import {
    createValidationMatrixVisual,
    type ValidationSetMatrix,
  } from './ValidationPage';
  import Tooltip from '../../components/base/Tooltip.svelte';
  import { tr } from '../../i18n';

  const gestures = stores.getGestures();
  const validationSets = stores.getValidationSets();
  const classifier = stores.getClassifier();
  const model = classifier.getModel();
  const validationResults = stores.getValidationResults();
  const accuracy = validationResults.getAccuracy();

  const autoUpdate = writable(false);

  $: {
    if ($model.isTrained && $autoUpdate && $validationSets.length) {
      handleEvaluateValidationSets();
    }
  }

  const handleEvaluateValidationSets = () => {
    validationResults.evaluateValidationSet();
  };

  const showPercentages = writable(false);

  const validationSetMatrix: Readable<ValidationSetMatrix> = derived(
    [validationResults, gestures, showPercentages],
    stores => {
      const [valRes, gests] = stores;
      const matrix = createValidationMatrixVisual(valRes, gests);
      const accuracy = matrix.accurateResults / validationSets.count();
      validationResults.setAccuracy(accuracy);
      return matrix;
    },
  );
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
      offset={{ x: -80, y: -60 }}
      title="(translate)You must train a model first!">
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

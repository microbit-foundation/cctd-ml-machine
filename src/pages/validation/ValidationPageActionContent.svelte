<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { stores } from '../../script/stores/Stores';
  import { derived, writable, type Readable } from 'svelte/store';
  import ValidationMatrix from './ValidationMatrix.svelte';
  import {
    createValidationMatrixVisual,
    evaluateValidationSet,
    type ValidationResult,
    type ValidationSetMatrix,
  } from './ValidationPage';
  import Tooltip from '../../components/base/Tooltip.svelte';

  const gestures = stores.getGestures();
  const validationSets = stores.getValidationSets();
  const classifier = stores.getClassifier();
  const model = classifier.getModel();
  const filters = classifier.getFilters();
  const validationResults = writable<ValidationResult>([]);

  let autoUpdate = false;

  $: {
    if ($model.isTrained && autoUpdate) {
      evaluateValidationSet($validationSets, model, filters).then(results =>
        validationResults.set(results),
      );
    }
  }

  const handleEvaluateValidationSets = () => {
    evaluateValidationSet($validationSets, model, filters).then(results =>
      validationResults.set(results),
    );
  };

  const showPercentages = writable(true);

  const validationSetMatrix: Readable<ValidationSetMatrix> = derived(
    [validationResults, gestures, showPercentages],
    stores => {
      const [valRes, gests] = stores;
      return createValidationMatrixVisual(valRes, gests);
    },
  );

  $: totalAccuracy = $validationSetMatrix.accurateResults / validationSets.count();
</script>

<div class="bg-white h-full flex flex-row justify-evenly">
  <div class="pl-2 flex flex-col justify-center">
    <div class="flex flex-row gap-2 justify-center">
      <p>Auto-update:</p>
      <input type="checkbox" bind:checked={autoUpdate} />
    </div>
    <Tooltip
      disabled={$model.isTrained}
      offset={{ x: -80, y: -60 }}
      title="(translate)You must train a model first!">
      <StandardButton disabled={!$model.isTrained} onClick={handleEvaluateValidationSets}>
        Test
      </StandardButton>
    </Tooltip>
  </div>

  <div class="flex flex-col justify-center text-center">
    <div class="flex">
      <div class="flex gap-2">
        <div class="flex flex-row self-center">
          <p>Percentage:</p>
        </div>
        <input type="checkbox" bind:checked={$showPercentages} />
      </div>
      <ValidationMatrix validationSetMatrix={$validationSetMatrix} showPercentages={$showPercentages} />
    </div>
  </div>
  <div class="flex flex-col justify-center">
    {#if !isNaN(totalAccuracy)}
      Accuracy: {(totalAccuracy * 100).toFixed(1)} %
    {:else}
      Accuracy: -
    {/if}
  </div>
</div>

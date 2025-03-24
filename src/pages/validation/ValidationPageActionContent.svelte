<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import { stores } from '../../script/stores/Stores';
  import { writable } from 'svelte/store';
  import ValidationMatrix from './ValidationMatrix.svelte';
  import {
    createValidationMatrix,
    evaluateValidationSet,
    type ValidationResult,
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

  $: matrix = createValidationMatrix($validationResults, $gestures);
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
      <StandardButton disabled={!$model.isTrained} onClick={handleEvaluateValidationSets}
        >Test</StandardButton>
    </Tooltip>
  </div>
  <div class="flex flex-col justify-center text-center">
    <ValidationMatrix {matrix} />
  </div>
</div>

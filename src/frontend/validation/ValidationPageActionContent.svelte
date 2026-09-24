<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { writable } from 'svelte/store';
  import ValidationMatrix from './ValidationMatrix.svelte';
  import { tr } from '../../i18n';
  import Tooltip from '../components/Tooltip.svelte';
  import StandardButton from '../components/buttons/StandardButton.svelte';
  import Switch from '../components/Switch.svelte';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import AccuracyMatrix from '../../core/classifier/AccuracyMatrix';

  const gestureController = getControllers().getGestureController();
  const gestures = gestureController.getGestures();
  const validationController = getControllers().getValidationController();
  const validationResult = validationController.getValidationResult();
  const classifierController = getControllers().getClassifierController();
  const modelTraining = classifierController.getModelTraining();
  $: accuracy = $validationResult?.getAccuracy();

  $: accuracyMatrix = $validationResult?.getMatrix();

  let bindAutoUpdate = validationController.shouldAutoUpdate().get();
  $: validationController.setAutoUpdate(bindAutoUpdate);

  const handleEvaluateValidationSets = async () => {
    await validationController.evaluateValidationSet();
  };

  const showPercentages = writable(false);
</script>

<div class="bg-white h-full flex flex-row justify-evenly">
  <div class="flex flex-col justify-center">
    <div class="flex flex-row gap-2 justify-center">
      <p>
        {$tr('content.validation.testButton.autoUpdate')}:
      </p>
      <Switch size="sm" bind:checked={bindAutoUpdate} />
    </div>
    <Tooltip
      disabled={!$modelTraining.hasPendingSettings()}
      offset={{ x: 30, y: 20 }}
      title={$tr('content.validation.tutorial.trainmodelfirst')}>
      <StandardButton
        disabled={$modelTraining.hasPendingSettings()}
        onClick={handleEvaluateValidationSets}>
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
          matrix={accuracyMatrix || AccuracyMatrix.fromSize($gestures.length)}
          showPercentages={$showPercentages} />
      </div>
    </div>
  </div>
  <div class="flex flex-col justify-center">
    {#if !!accuracy}
      <p>
        {$tr('content.validation.accuracy')}:
      </p>
      <p class="text-center">
        {(accuracy * 100).toFixed(1)} %
      </p>
    {:else}
      {$tr('content.validation.accuracy')}: -
    {/if}
  </div>
</div>

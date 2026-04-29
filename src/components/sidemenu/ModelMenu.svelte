<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import type { AbstractReadonlyState } from '../../backend/statemanagement/AbstractReadonlyState';
  import type { NewGesture } from '../../core/entities/NewGesture';
  import { t } from '../../i18n';

  const bestPrediction: AbstractReadonlyState<NewGesture | undefined> = getControllers()
    .getGestureController()
    .getMostConfident();
  const confidences = getControllers().getGestureController().getConfidences();
  $: confidence = !!$bestPrediction
    ? ($confidences.getConfidence($bestPrediction) ?? 0)
    : 0;

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();

  const getPredictionLabel = (
    isInputReady: boolean,
    bestPrediction: NewGesture | undefined,
  ) => {
    if (!bestPrediction) {
      return $t('menu.model.noModel');
    }
    if (!isInputReady) {
      return $t('menu.model.connectInputMicrobit');
    }
    return bestPrediction.getName();
  };

  const classifier = getControllers().getClassifierController().getClassifier();

  $: confidenceLabel = Math.round(confidence * 100).toString() + '%';
  $: predictionLabel = getPredictionLabel(
    $microbitConnection.getInput().isReady(),
    $bestPrediction,
  );
</script>

<div class="w-full text-center justify-center pt-5">
  {#if !$classifier}
    <div
      class="h-34 w-34 m-auto mb-8 border-2 border-white border-opacity-30 rounded-lg border-dashed font-bold text-warm-gray-300">
      <div class="flex h-full">
        <div class="m-auto">
          {$t('menu.model.noModel')}
        </div>
      </div>
    </div>
  {:else}
    <div
      class="grid break-words mr-auto ml-auto w-3/4 h-70px border-2 rounded-lg border-solid text-center align-center content-center">
      <p
        class="w-full max-w-[100%] text-2xl break-all"
        class:text-2xl={$microbitConnection.getInput().isReady()}
        class:text-md={!$microbitConnection.getInput().isReady()}>
        {predictionLabel}
      </p>
    </div>
    <p class="text-4xl ml-5 mt-4 pb-4">
      {confidenceLabel}
    </p>
  {/if}
</div>

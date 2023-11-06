<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { state } from '../script/stores/uiStore';
  import { bestPrediction } from '../script/stores/mlStore';
  import { t } from '../i18n';

  $: confidence = $state.isInputReady
    ? $bestPrediction?.confidence.currentConfidence ?? 0
    : 0;
  confidence = isNaN(confidence) ? 0 : confidence;

  $: confidenceLabel = Math.round(confidence * 100).toString() + '%';
  $: predictionLabel = !$state.isInputReady ? '' : $bestPrediction?.name ?? '';
</script>

<div class="w-full text-center justify-center pt-5">
  {#if !$state.isPredicting}
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
      <p class="w-full max-w-[100%] text-2xl break-all">
        {predictionLabel}
      </p>
    </div>
    <p class="text-4xl ml-5 mt-4 pb-4">
      {confidenceLabel}
    </p>
  {/if}
</div>

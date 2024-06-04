<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { stores } from '../../script/stores/Stores';
  import { highlightedAxis, state } from '../../script/stores/uiStore';
  import AxesFilterVectorView from '../../components/graphs/knngraph/AxesFilterVectorView.svelte';
  import { trainModel } from './TrainingPage';
  import ModelRegistry from '../../script/domain/ModelRegistry';
  import KnnModelGraph from '../../components/graphs/knngraph/KnnModelGraph.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import Axes from '../../script/domain/Axes';
  import { t } from '../../i18n';
  import { onMount } from 'svelte';

  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();
  const confidences = gestures.getConfidences();
  const filters = classifier.getFilters();
  // Should be in KNNModelGraph instead
  onMount(() => {
    trainModel(ModelRegistry.KNN);
  });
  $: {
    if ($highlightedAxis === undefined) {
      $highlightedAxis = Axes.X;
    }
    if (!$classifier.model.isTrained) {
      trainModel(ModelRegistry.KNN);
    }
  }
</script>

<div
  class="flex flex-row flex-grow justify-evenly"
  class:hidden={!$classifier.model.isTrained}>
  <div class="flex flex-col justify-center mr-6">
    <AxesFilterVectorView />
    <div class="flex flex-col ml-2 justify-center mt-2">
      {#each $gestures as gesture, index}
        <div class="flex flex-row justify-between">
          <div class="flex flex-row">
            <div class="flex flex-col justify-center mr-1">
              <div
                class="rounded-full w-3 h-3"
                style={'background-color:' + StaticConfiguration.gestureColors[index]} />
            </div>
            <p>{gesture.name}</p>
          </div>
          {#if $state.isInputReady}
            <p>
              {(($confidences.get(gesture.ID)?.currentConfidence ?? 0) * 100).toFixed(2)}%
            </p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  {#if $filters.length == 2}
    <KnnModelGraph />
  {:else}
    <div class="m-auto">
      <p class="max-w-80 text-md font-bold text-center">
        {$t('menu.trainer.knn.onlyTwoFilters')}
      </p>
    </div>
  {/if}
</div>

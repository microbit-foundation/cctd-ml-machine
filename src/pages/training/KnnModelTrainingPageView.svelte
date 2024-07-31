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
  import { knnConfig } from '../../script/stores/knnConfig';
  import Logger from '../../script/utils/Logger';
  const classifier = stores.getClassifier();
  const confidences = stores.getConfidences();
  const gestures = stores.getGestures();
  //const confidences = gestures.getConfidences();
  const filters = classifier.getFilters();

  onMount(() => {
    trainModel(ModelRegistry.KNN);
    return () => unsubscribe();
  });
  $: {
    if ($highlightedAxis === undefined) {
      $highlightedAxis = Axes.X;
    }
    if (!$classifier.model.isTrained) {
      trainModel(ModelRegistry.KNN);
    }
  }

  const unsubscribe = highlightedAxis.subscribe(axis => {
    trainModel(ModelRegistry.KNN);
  });

  const noOfRecordings = $gestures.reduce(
    (acc, gesture) => acc + gesture.recordings.length,
    0,
  );
  const maxK = noOfRecordings;
  const changeK = (amount: number) => {
    const newVal = Math.max($knnConfig.k + amount, 1);
    knnConfig.set({ k: newVal });
    trainModel(ModelRegistry.KNN);
  };
  $: {
    if ($knnConfig.k > maxK) {
      knnConfig.set({ k: maxK });
    }
  }
</script>

<div
  class="flex flex-row flex-grow justify-evenly"
  class:hidden={!$classifier.model.isTrained}>
  <div class="flex flex-col justify-center mr-6">
    <div class="flex space-x-2 flex-row mb-2">
      <div class="flex flex-row">
        <div
          on:click={() => changeK(-1)}
          class="bg-secondary font-bold text-secondarytext cursor-pointer select-none hover:bg-opacity-60 border-primary border-r-1 content-center px-2 rounded-l-xl">
          -
        </div>
        <div
          on:click={() => changeK(1)}
          class="bg-secondary border-primary text-secondarytext cursor-pointer hover:bg-opacity-60 select-none content-center px-2 rounded-r-xl">
          +
        </div>
      </div>
      <p class="text-md content-center">
        {$knnConfig.k}
        {$t('content.trainer.knn.neighbours')}
      </p>
    </div>
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
              {(($confidences.get(gesture.ID) ?? 0) * 100).toFixed(2)}%
            </p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  {#if $filters.length == 2}
    <KnnModelGraph />
  {:else}
    <div class="max-w-[450px] flex flex-col justify-center">
      <p class="max-w-80 text-md font-bold text-center">
        {$t('menu.trainer.knn.onlyTwoFilters')}
      </p>
    </div>
  {/if}
</div>

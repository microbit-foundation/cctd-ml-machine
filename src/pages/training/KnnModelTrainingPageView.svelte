<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { stores } from '../../lib/stores/Stores';
  import { trainModel } from './TrainingPage';
  import ModelRegistry from '../../lib/domain/ModelRegistry';
  import { t } from '../../i18n';
  import PredictionLegend from './PredictionLegend.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import AxesFilterVectorView from '../../components/features/graphs/knngraph/AxesFilterVectorView.svelte';
  import KnnModelGraph from '../../components/features/graphs/knngraph/KnnModelGraph.svelte';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();
  const filters = classifier.getFilters();
  const highlightedAxis = stores.getHighlightedAxes();
  const availableAxes = stores.getAvailableAxes();

  const knnModelSettings = stores.getKNNModelSettings();

  $: {
    if (!$classifier.model.isTrained) {
      trainModel(ModelRegistry.KNN);
    }
  }

  const noOfRecordings = $gestures.reduce(
    (acc, gesture) => acc + gesture.recordings.length,
    0,
  );
  const maxK = noOfRecordings;
  const changeK = (amount: number) => {
    const newVal = Math.max($knnModelSettings.k + amount, 1);
    knnModelSettings.setK(newVal);
    trainModel(ModelRegistry.KNN);
  };
  $: {
    if ($knnModelSettings.k > maxK) {
      knnModelSettings.setK(maxK);
    }
  }
</script>

{#if $highlightedAxis.length === 1}
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
          {$knnModelSettings.k}
          {$t('content.trainer.knn.neighbours')}
        </p>
      </div>
      <AxesFilterVectorView />
      <div class="flex flex-col ml-2 justify-center mt-2">
        <PredictionLegend />
      </div>
    </div>
    {#if $filters.length == 2 && $classifier.model.isTrained && $highlightedAxis.length === 1}
      <KnnModelGraph />
    {:else}
      <div class="max-w-[450px] flex flex-col justify-center">
        <p class="max-w-80 text-md font-bold text-center">
          {$t('menu.trainer.knn.onlyTwoFilters')}
        </p>
      </div>
    {/if}
  </div>
{:else}
  <div class="flex flex-col flex-grow justify-center items-center gap-4">
    <p class="text-lg max-w-120">{$t('content.trainer.knn.selectOneAxis')}</p>
    <div class="flex flex-row gap-2">
      <StandardButton
        colorOverride={StaticConfiguration.graphColors[0]}
        onClick={() => highlightedAxis.set([$availableAxes[0]])}>
        X
      </StandardButton>
      <StandardButton
        colorOverride={StaticConfiguration.graphColors[1]}
        onClick={() => highlightedAxis.set([$availableAxes[1]])}>
        Y
      </StandardButton>
      <StandardButton
        colorOverride={StaticConfiguration.graphColors[2]}
        onClick={() => highlightedAxis.set([$availableAxes[2]])}>
        Z
      </StandardButton>
    </div>
  </div>
{/if}

<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { stores } from '../../lib/stores/Stores';
  import { t } from '../../i18n';
  import PredictionLegend from './PredictionLegend.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import AxesFilterVectorView from '../../components/features/graphs/knngraph/AxesFilterVectorView.svelte';
  import KnnModelGraph from '../../components/features/graphs/knngraph/KnnModelGraph.svelte';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import { knnHasTrained } from '../../lib/stores/KNNStores';
  import { trainKNNModel } from './TrainingPage';
  import KnnModelSettings from '../../components/features/training/KNNModelSettings.svelte';
  import { onMount } from 'svelte';

  const devices = stores.getDevices();
  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();
  const filters = classifier.getFilters();
  const highlightedAxis = stores.getHighlightedAxes();
  const availableAxes = stores.getAvailableAxes();

  const knnModelSettings = stores.getKNNModelSettings();

  $: {
    if (!$classifier.model.isTrained && $classifier.model.hasModel) {
      if ($knnHasTrained) {
        // Only train if the knn model has been trained before
        trainKNNModel();
      }
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
  };
  $: {
    if ($knnModelSettings.k > maxK) {
      knnModelSettings.setK(maxK);
    }
  }
</script>

<div class="flex flex-col flex-grow gap-2 justify-center flex-grow">
  {#if !$knnHasTrained}
    <div class="flex gap-2 flex-col justify-center">
      <div class="flex justify-center mb-4">
        <KnnModelSettings />
      </div>
      {#if $highlightedAxis.length === 1}
        <div class="flex justify-center">
          <StandardButton onClick={() => trainKNNModel()}>
            {$t('menu.trainer.trainModelButtonSimple')}
          </StandardButton>
        </div>
      {/if}
    </div>
  {/if}
  {#if $highlightedAxis.length === 1}
    <div
      class="flex flex-row flex-grow justify-evenly"
      class:hidden={!$classifier.model.isTrained}>
      <div class="flex flex-col mr-6 flex-grow justify-center gap-6">
        <div class="flex">
          <KnnModelSettings />
        </div>
        <div>
          <AxesFilterVectorView />
        </div>
        <div>
          <PredictionLegend />
        </div>
      </div>
      {#if $filters.length == 2 && $classifier.model.isTrained && $highlightedAxis.length === 1}
        <KnnModelGraph />
      {:else}
        <div class="max-w-[450px] flex-grow flex flex-col justify-center">
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
</div>

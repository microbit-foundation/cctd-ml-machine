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
    import { getControllers } from '../../backend/interface-adapter/MLMachine';
  
  const controllers = getControllers();
  const axisController = controllers.getAxisController();
  const selectedAxes = axisController.getSelectedAxes()

  const classifier = stores.getClassifier();
  const gestures = stores.getGestures();
  const filters = classifier.getFilters();
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
      {#if $selectedAxes.length === 1}
        <div class="flex justify-center">
          <StandardButton onClick={() => trainKNNModel()}>
            {$t('menu.trainer.trainModelButtonSimple')}
          </StandardButton>
        </div>
      {/if}
    </div>
  {/if}
  {#if $selectedAxes.length === 1}
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
      {#if $filters.length == 2 && $classifier.model.isTrained && $selectedAxes.length === 1}
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
          onClick={() => axisController.setSelectedAxes([$availableAxes[0]])}>
          X
        </StandardButton>
        <StandardButton
          colorOverride={StaticConfiguration.graphColors[1]}
          onClick={() => axisController.setSelectedAxes([$availableAxes[1]])}>
          Y
        </StandardButton>
        <StandardButton
          colorOverride={StaticConfiguration.graphColors[2]}
          onClick={() => axisController.setSelectedAxes([$availableAxes[2]])}>
          Z
        </StandardButton>
      </div>
    </div>
  {/if}
</div>

<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { t } from '../../i18n';
  import PredictionLegend from './PredictionLegend.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import AxesFilterVectorView from '../../components/features/graphs/knngraph/AxesFilterVectorView.svelte';
  import KnnModelGraph from '../../components/features/graphs/knngraph/KnnModelGraph.svelte';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import KnnModelSettings from '../../components/features/training/KNNModelSettings.svelte';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import { ModelType } from '../../core/model/ModelType';

  const classifierController = getControllers().getClassifierController();
  const classifier = classifierController.getClassifier();
  const filters = getControllers().getFilterController().getFilters();
  const highlightedAxis = getControllers().getAxisController().getSelectedAxes();
  const availableAxes = getControllers().getAxisController().getAvailableAxes();
  $: knnHasTrained = $classifier?.getModelType() === ModelType.KNN;
</script>

<div class="flex flex-col flex-grow gap-2 justify-center flex-grow">
  {#if !knnHasTrained}
    <div class="flex gap-2 flex-col justify-center">
      <div class="flex justify-center mb-4">
        <KnnModelSettings />
      </div>
      {#if $highlightedAxis.length === 1}
        <div class="flex justify-center">
          <StandardButton
            onClick={() => {
              getControllers().getClassifierController().trainKNNModel();
            }}>
            {$t('menu.trainer.trainModelButtonSimple')}
          </StandardButton>
        </div>
      {/if}
    </div>
  {/if}
  {#if $highlightedAxis.length === 1}
    <div class="flex flex-row flex-grow justify-evenly" class:hidden={!$classifier}>
      {#if knnHasTrained}
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
      {/if}
      {#if $filters.length == 2 && !!$classifier && $highlightedAxis.length === 1 && knnHasTrained}
        <KnnModelGraph />
      {:else if knnHasTrained}
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
          onClick={() => {
            getControllers().getAxisController().setSelectedAxes([$availableAxes[0]]);
          }}>
          X
        </StandardButton>
        <StandardButton
          colorOverride={StaticConfiguration.graphColors[1]}
          onClick={() =>
            getControllers().getAxisController().setSelectedAxes([$availableAxes[1]])}>
          Y
        </StandardButton>
        <StandardButton
          colorOverride={StaticConfiguration.graphColors[2]}
          onClick={() =>
            getControllers().getAxisController().setSelectedAxes([$availableAxes[2]])}>
          Z
        </StandardButton>
      </div>
    </div>
  {/if}
</div>

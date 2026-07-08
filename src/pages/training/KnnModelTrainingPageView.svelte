<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { t } from '../../i18n';
  import PredictionLegend from './PredictionLegend.svelte';
  import AxesFilterVectorView from '../../components/features/graphs/knngraph/AxesFilterVectorView.svelte';
  import KnnModelGraph from '../../components/features/graphs/knngraph/KnnModelGraph.svelte';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import KnnModelSettings from '../../components/features/training/KNNModelSettings.svelte';
  import AxisPicker from './AxisPicker.svelte';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import { ModelType } from '../../core/model/ModelType';

  const classifierController = getControllers().getClassifierController();
  const axisController = getControllers().getAxisController();
  const classifier = classifierController.getClassifier();
  const filters = getControllers().getFilterController().getFilters();
  const highlightedAxis = axisController.getSelectedAxes();
  const availableAxes = axisController.getAvailableAxes();

  const trainKNNModel = () => classifierController.trainKNNModel();
  const selectAxis = (axisIndex: number) =>
    axisController.setSelectedAxes([$availableAxes[axisIndex]]);

  $: knnHasTrained = $classifier?.getModelType() === ModelType.KNN;
  $: hasSingleHighlightedAxis = $highlightedAxis.length === 1;
  $: hasClassifier = !!$classifier;
  $: showTrainingControls = !knnHasTrained;
  $: showTrainingResults = hasSingleHighlightedAxis && knnHasTrained;
  $: showGraph = showTrainingResults && hasClassifier && $filters.length === 2;
  $: showGraphFallback = showTrainingResults && !showGraph;
</script>

<div class="flex flex-col flex-grow gap-2 justify-center flex-grow">
  {#if hasSingleHighlightedAxis}
    {#if showTrainingControls}
      <div class="flex gap-2 flex-col justify-center">
        <div class="flex justify-center mb-4">
          <KnnModelSettings />
        </div>
        <div class="flex justify-center">
          <StandardButton onClick={trainKNNModel}>
            {$t('menu.trainer.trainModelButtonSimple')}
          </StandardButton>
        </div>
      </div>
    {/if}

    <div class="flex flex-row flex-grow justify-evenly" class:hidden={!hasClassifier}>
      {#if showTrainingResults}
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

      {#if showGraph}
        <KnnModelGraph />
      {:else if showGraphFallback}
        <div class="max-w-[450px] flex-grow flex flex-col justify-center">
          <p class="max-w-80 text-md font-bold text-center">
            {$t('menu.trainer.knn.onlyTwoFilters')}
          </p>
        </div>
      {/if}
    </div>
  {:else}
    <AxisPicker onAxisSelect={selectAxis} />
  {/if}
</div>

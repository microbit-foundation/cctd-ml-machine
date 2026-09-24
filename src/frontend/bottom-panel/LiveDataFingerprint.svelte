<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import Fingerprint from '../components/recording/Fingerprint.svelte';
  import { Feature, getFeature } from '../lib/FeatureToggles';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import { VectorPredictionInput } from '../../core/classifier/vector-classifier/VectorPredictionInput';

  export let gestureName: string;
  const filters = getControllers().getFilterController().getFilters();
  const highlightedAxes = getControllers().getAxisController().getSelectedAxes();
  const liveData = getControllers().getDataController().getLiveData();
  let filteredNormalizedInput: null | number[] = null;

  $: filtersLabels = $filters.flatMap(filter => {
    const filterName = filter.getName();
    return $highlightedAxes.map(axis => `${filterName} - ${axis.label}`);
  });
  // $: fingerprint = $classifier.filteredInput.normalized.getValue();
  onMount(() => {
    return liveData?.subscribe(() => {
      try {
        if (liveData) {
          const bufferedData = $liveData
            .getBuffer()
            .getSeries(
              getFeature<number>(Feature.RECORDING_DURATION),
              StaticConfiguration.pollingPredictionSampleSize,
            );
          filteredNormalizedInput = getControllers()
            .getDataController()
            .graphNormalize(
              VectorPredictionInput.getFilteredForAxes(
                $filters,
                bufferedData.map(e => e.value),
                $highlightedAxes,
              ).getInput(),
            )
            .getValue();
        }
      } catch (error) {}
    });
  });
</script>

<div class="w-7 h-full">
  {#if !!filteredNormalizedInput}
    <Fingerprint
      filterLabels={filtersLabels}
      title={gestureName}
      fingerprint={filteredNormalizedInput} />
  {/if}
</div>

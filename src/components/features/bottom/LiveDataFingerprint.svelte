<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { ClassifierInput } from '../../../lib/domain/ClassifierInput';
  import { stores } from '../../../lib/stores/Stores';
  import StaticConfiguration from '../../../StaticConfiguration';
  import Fingerprint from '../../ui/recording/Fingerprint.svelte';

  export let gestureName: string;
  const classifier = stores.getClassifier();
  const filters = classifier.getFilters();
  const highlightedAxes = stores.getHighlightedAxes();
  $: liveData = $stores.liveData;
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
          const bufferedData = liveData
            .getBuffer()
            .getSeries(
              StaticConfiguration.pollingPredictionSampleDuration,
              StaticConfiguration.pollingPredictionSampleSize,
            );
          filteredNormalizedInput = ClassifierInput.getInputForAxes(
            bufferedData.map(e => e.value),
            $highlightedAxes,
          ).getNormalizedInput(filters);
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

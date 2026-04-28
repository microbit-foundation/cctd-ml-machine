<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import type { Recording } from '../../../core/entities/recording/Recording';
  import BaseVector from '../../../core/vector/BaseVector';
  import type { Vector } from '../../../core/vector/Vector';
  import Fingerprint from './Fingerprint.svelte';

  export let recording: Recording;
  export let gestureName: string;
  const highlightedAxes = getControllers().getAxisController().getSelectedAxes();
  const filters = getControllers().getFilterController().getFilters();
  const dataController = getControllers().getDataController();

  $: filtersLabels = (() => {
    const labels: string[] = [];
    $filters.forEach(filter => {
      const filterName = filter.getName();
      $highlightedAxes.forEach(axis => {
        labels.push(`${filterName} - ${axis.label}`);
      });
    });
    return labels;
  })();

  let fingerprint: Vector = new BaseVector([]);

  highlightedAxes.subscribe(() => {
    const sampleInput = dataController
      .extractSelectedAxesFromRecording(recording)
      .getSamples();
    fingerprint = dataController.graphNormalize(dataController.applyFilters(sampleInput));
  });
</script>

<Fingerprint
  filterLabels={filtersLabels}
  title={gestureName}
  fingerprint={fingerprint.getValue()} />

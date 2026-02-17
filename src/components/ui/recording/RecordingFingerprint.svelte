<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import type { Recording } from '../../../core/entities/recording/Recording';
  import BaseVector from '../../../core/vector/BaseVector';
  import { stores } from '../../../lib/stores/Stores';
  import Fingerprint from './Fingerprint.svelte';

  export let recording: Recording;
  export let gestureName: string;
  const classifier = stores.getClassifier();
  const highlightedAxes = stores.getHighlightedAxes();
  const filters = classifier.getFilters();

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

  $: fingerprint = (() => {
    const sampleInputVectorIndices = $highlightedAxes.map(axis => axis.index);
    const sampleInput = recording.getSamples().reduce(
      (pre, cur) => {
        sampleInputVectorIndices.forEach(idx => {
          if (pre[idx.toString()] === undefined) {
            pre[idx.toString()] = [cur.getValue()[idx]];
          } else {
            pre[idx.toString()]!.push(cur.getValue()[idx]);
          }
        });
        return pre;
      },
      {} as { [key: string]: number[] | undefined },
    );

    const vectorInput: number[] = [];
    Object.entries(sampleInput).forEach(([key, val]) => {
      if (!val) return;
      vectorInput.push(...filters.computeNormalized(val));
    });

    return new BaseVector(vectorInput).getValue();
  })();
</script>

<Fingerprint filterLabels={filtersLabels} title={gestureName} {fingerprint} />

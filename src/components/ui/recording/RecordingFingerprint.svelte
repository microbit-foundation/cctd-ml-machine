<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import type { RecordingData } from '../../../lib/domain/RecordingData';
  import { stores } from '../../../lib/stores/Stores';
  import type { Vector } from '../../../lib/domain/Vector';
  import BaseVector from '../../../lib/domain/BaseVector';
  import Fingerprint from './Fingerprint.svelte';

  export let recording: RecordingData;
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
    const sampleInput = recording.samples.reduce(
      (pre, cur) => {
        sampleInputVectorIndices.forEach(idx => {
          if (pre[idx.toString()] === undefined) {
            pre[idx.toString()] = [cur.vector[idx]];
          } else {
            pre[idx.toString()]!.push(cur.vector[idx]);
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

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

  const filtersLabels: string[] = [];
  const filters = classifier.getFilters();
  $filters.forEach(filter => {
    const filterName = filter.getName();
    filtersLabels.push(`${filterName} - x`, `${filterName} - y`, `${filterName} - z`);
  });
  const getFilteredInput = (): Vector => {
    const [xs, ys, zs] = recording.samples.reduce(
      (pre, cur) => {
        pre[0].push(cur.vector[0]);
        pre[1].push(cur.vector[1]);
        pre[2].push(cur.vector[2]);
        return pre;
      },
      [[] as number[], [] as number[], [] as number[]],
    );

    return new BaseVector([
      ...filters.computeNormalized(xs),
      ...filters.computeNormalized(ys),
      ...filters.computeNormalized(zs),
    ]);
  };
  const fingerprint: number[] = getFilteredInput().getValue();
</script>

<div class="relative w-full w-11 h-93px overflow-hidden rounded-sm mr-3">
  <div class="absolute h-full w-full -left-10px overflow-hidden">
    <Fingerprint filterLabels={filtersLabels} title={gestureName} {fingerprint} />
  </div>
</div>

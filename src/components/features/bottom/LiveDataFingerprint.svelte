<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { stores } from '../../../lib/stores/Stores';
  import Fingerprint from '../../ui/recording/Fingerprint.svelte';

  export let gestureName: string;
  const classifier = stores.getClassifier();
  const filters = classifier.getFilters();

  $: filtersLabels = $filters.flatMap(filter => {
    const filterName = filter.getName();
    return [`${filterName} - x`, `${filterName} - y`, `${filterName} - z`];
  });
  $: fingerprint = $classifier.filteredInput.normalized.getValue();
</script>

<div class="w-7 overflow-hidden">
  <div style="margin-left: -8px;margin-bottom: -7px">
    <Fingerprint
      height={166}
      width={100}
      filterLabels={filtersLabels}
      title={gestureName}
      {fingerprint} />
  </div>
</div>

<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { t } from '../../i18n';
  import StandardButton from '../components/buttons/StandardButton.svelte';
  import StaticConfiguration from '../../StaticConfiguration';

  export let onAxisSelect: (axisIndex: number) => void;
</script>

<div class="flex flex-col flex-grow justify-center items-center gap-4">
  <p class="text-lg max-w-120">{$t('content.trainer.knn.selectOneAxis')}</p>
  <div class="flex flex-row gap-2">
    <StandardButton
      colorOverride={StaticConfiguration.graphColors[0]}
      onClick={() => onAxisSelect(0)}>
      X
    </StandardButton>
    <StandardButton
      colorOverride={StaticConfiguration.graphColors[1]}
      onClick={() => onAxisSelect(1)}>
      Y
    </StandardButton>
    <StandardButton
      colorOverride={StaticConfiguration.graphColors[2]}
      onClick={() => onAxisSelect(2)}>
      Z
    </StandardButton>
  </div>
</div>

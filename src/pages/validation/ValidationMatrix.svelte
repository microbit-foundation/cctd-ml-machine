<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import Matrix from '../../lib/domain/Matrix';
  import { stores } from '../../lib/stores/Stores';
  import type { ValidationSetMatrix } from './ValidationPage';
  import { t } from '../../i18n';

  const gestures = stores.getGestures();

  export let validationSetMatrix: ValidationSetMatrix;
  export let showPercentages: boolean;

  $: rowSums = $gestures.map((_, gestureIdx) => {
    return validationSetMatrix.matrix
      .getRow(gestureIdx)
      .reduce((pre, cur) => pre + cur, 0);
  });
  $: percentageMatrix = new Matrix(
    validationSetMatrix.matrix.getValues().map((row, rowIdx) => {
      return row.map(col => {
        return col / rowSums[rowIdx];
      });
    }),
  );
  $: matrix = showPercentages ? percentageMatrix : validationSetMatrix.matrix;
</script>

<table>
  <thead>
    <tr>
      <td colspan="2"> </td><td colspan={$gestures.length}
        >{$t('content.validation.matrix.predicted')}</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan={$gestures.length + 1} class="write-vertical-right pt-[1.5em]">
        {$t('content.validation.matrix.actual')}
      </td>
      <td />
      {#each $gestures as gesture}
        <td class="w-20 border-1">{gesture.name}</td>
      {/each}
    </tr>

    {#each $gestures as gesture, rowIdx}
      <tr>
        <td class="border-l-1 pl-2 border-1">{gesture.name}</td>
        {#each matrix.getRow(rowIdx) as val, colIdx}
          <td class="border-1" class:bg-green-50={rowIdx === colIdx}>
            {#if showPercentages}
              {isNaN(val) ? '-' : (val * 100).toFixed(0) + '%'}
            {:else}
              {val}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

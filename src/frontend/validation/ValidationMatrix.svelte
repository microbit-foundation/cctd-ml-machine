<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import Matrix from '../../core/entities/Matrix';
  import { t } from '../../i18n';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import type AccuracyMatrix from '../../core/classifier/AccuracyMatrix';

  const gestures = getControllers().getGestureController().getGestures();

  export let matrix: AccuracyMatrix;
  // TODO: Fix, make the correct size (len(gestures)^2)
  export let showPercentages: boolean;

  $: rowSums = $gestures.map((_, gestureIdx) => {
    return matrix.getRow(gestureIdx).reduce((pre, cur) => pre + cur, 0);
  });

  $: percentageMatrix = new Matrix(
    matrix.toArray().map((row, rowIdx) => {
      return row.map(col => {
        return col / rowSums[rowIdx];
      });
    }),
  );
  $: displayMatrix = showPercentages ? percentageMatrix : matrix;
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
        <td class="w-20 border-1">{gesture.getName()}</td>
      {/each}
    </tr>

    {#each $gestures as gesture, rowIdx}
      <tr>
        <td class="border-l-1 pl-2 border-1">{gesture.getName()}</td>
        {#each displayMatrix.getRow(rowIdx) as val, colIdx}
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

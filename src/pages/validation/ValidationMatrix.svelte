<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import Matrix from '../../script/domain/Matrix';
  import { stores } from '../../script/stores/Stores';
  import type { ValidationSetMatrix } from './ValidationPage';

  const gestures = stores.getGestures();

  export let validationSetMatrix: ValidationSetMatrix;
  export let showPercentages: boolean;

  $: columnSums = $gestures.map((_, gestureIdx) => {
    return validationSetMatrix.matrix
      .getColumn(gestureIdx)
      .reduce((pre, cur) => pre + cur, 0);
  });
  $: percentageMatrix = new Matrix(
    validationSetMatrix.matrix.getValues().map((row, rowIdx) => {
      return row.map((col, colIdx) => {
        return col / columnSums[colIdx];
      });
    }),
  );
  $: matrix = showPercentages ? percentageMatrix : validationSetMatrix.matrix;
</script>

<table>
  <thead>
    <tr>
      <td colspan="2"> </td><td colspan={$gestures.length}>Predicted</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan={$gestures.length + 1} class="write-vertical-right pt-[1.5em]">
        Actual
      </td>
      <td />
      {#each $gestures as gesture, idx}
        <td class="w-20 border-1">{gesture.name}</td>
      {/each}
    </tr>

    {#each $gestures as gesture, rowIdx}
      <tr>
        <td class="border-l-1 pl-2 border-1">{gesture.name}</td>
        {#each matrix.getRow(rowIdx) as val}
          <td class="border-1">
            {#if showPercentages}
              {isNaN(val) ? '-' : (val * 100).toFixed(0) + "%"}
            {:else}
              {val}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

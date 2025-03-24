<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { stores } from '../../script/stores/Stores';

  const gestures = stores.getGestures();
  export let matrix: number[][];
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
        {#each matrix[rowIdx] as val}
          <td class="border-1">{val}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

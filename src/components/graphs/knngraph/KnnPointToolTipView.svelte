<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StaticConfiguration from '../../../StaticConfiguration';
  import { classifier } from '../../../script/stores/Stores';
  import { knnHighlightedPoint } from './KnnPointToolTip';

  const offsetX = 7;
  const offsetY = 30;
  $: position = {
    x: ($knnHighlightedPoint?.pointTransformed.projected.x ?? 0) + offsetX,
    y: ($knnHighlightedPoint?.pointTransformed.projected.y ?? 0) + offsetY,
  };

  $: content = {
    values: [
      $knnHighlightedPoint?.pointTransformed.x,
      $knnHighlightedPoint?.pointTransformed.y,
      classifier.getFilters().count() === 3
        ? $knnHighlightedPoint?.pointTransformed.z
        : undefined,
    ],
  };

  $: borderColor = $knnHighlightedPoint?.color;
</script>

<div
  on:mouseleave={() => knnHighlightedPoint.set(undefined)}
  class:hidden={$knnHighlightedPoint === undefined}
  class="absolute bg-white py-1 px-1 border-solid border-2 rounded font-bold"
  style={`top:${position.y}px; left:${position.x}px;border-color:${borderColor}`}>
  {#each content.values as val, index}
    {#if val}<!--val may be undefined for 2d knn graph-->
      <p style={`color:${StaticConfiguration.liveGraphColors[index]}`}>
        {val?.toFixed(2)}
      </p>
    {/if}
  {/each}
</div>

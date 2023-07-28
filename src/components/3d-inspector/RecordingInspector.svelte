<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import View3D from './View3D.svelte';
  import { Vector3 } from './View3DUtility';

  export let dataPoint: Vector3;
  export let position: { x: number; y: number };
  export let size: number;
  export let isOpen: boolean;
</script>

{#if isOpen}
  <div class="fixed z-10" style="left: {position.x}px; top: {position.y}px;">
    <div
      class="
        absolute
        border-gray-200
        overflow-hidden
        border
        border-solid
        relative
        bg-white
        rounded-1
        shadow-dark-400
        shadow-md
        flex
        justify-center"
      style="width: {size}px; height: {size}px;">
      <View3D {dataPoint} height={size} width={size} smoothing={true} />
    </div>
  </div>
{/if}

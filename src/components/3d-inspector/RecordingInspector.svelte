<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import View3D from './View3D.svelte';
  import { Vector3 } from './View3DUtility';

  export let sample: number[];
  export let position: { x: number; y: number };
  export let size: number;
  export let isOpen: boolean;

  const is3d = sample.length === 3;

  const x = is3d ? sample[0] : 0;
  const y = is3d ? sample[1] : 0;
  const z = is3d ? sample[2] : 0;
  const sample3d: Vector3 = { x, y, z };
</script>

{#if isOpen && is3d}
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
      <View3D sample={sample3d} height={size} width={size} smoothing={true} />
    </div>
  </div>
{/if}

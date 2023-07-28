<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { currentData } from '../../script/stores/mlStore';
  import View3D from './View3D.svelte';
  import { Vector3 } from './View3DUtility';

  export let smoothing = false;
  export let width: number;
  export let height: number;
  export let freeze = false;

  let liveDataPoint: Vector3 = { x: 0, y: 0, z: 0 };

  $: {
    if (!freeze) {
      liveDataPoint = $currentData;
    }
  }
</script>

<View3D {smoothing} {width} {height} dataPoint={liveDataPoint} />

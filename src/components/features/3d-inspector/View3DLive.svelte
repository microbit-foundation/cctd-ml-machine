<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import SmoothedLiveData from '../../../lib/livedata/SmoothedLiveData';
  import { stores } from '../../../lib/stores/Stores';
  import View3D from './View3D.svelte';
  import { type Vector3 } from './View3DUtility';

  export let smoothing = false;
  export let width: number;
  export let height: number;
  export let freeze = false;

  let liveDataPoint: Vector3 = { x: 0, y: 0, z: 0 };

  $: smoothedLiveData = $stores.liveData
    ? new SmoothedLiveData($stores.liveData, 3)
    : undefined;

  $: {
    if (!freeze && $smoothedLiveData !== undefined) {
      liveDataPoint = {
        x: $smoothedLiveData.getValue()[0],
        y: $smoothedLiveData.getValue()[1],
        z: $smoothedLiveData.getValue()[2],
      };
    }
  }
</script>

<View3D {smoothing} {width} {height} sample={liveDataPoint} />

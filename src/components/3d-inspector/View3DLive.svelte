<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import SmoothedLiveData from '../../script/livedata/SmoothedLiveData';
  import { stores } from '../../script/stores/Stores';
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
        x: $smoothedLiveData.getVector()[0],
        y: $smoothedLiveData.getVector()[1],
        z: $smoothedLiveData.getVector()[2],
      };
    }
  }
</script>

<View3D {smoothing} {width} {height} sample={liveDataPoint} />

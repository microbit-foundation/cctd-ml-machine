<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import SmoothedLiveData from '../../script/livedata/SmoothedLiveData';
  import { liveAccelerometerData } from '../../script/stores/Stores';
  import View3D from './View3D.svelte';
  import { Vector3 } from './View3DUtility';

  export let smoothing = false;
  export let width: number;
  export let height: number;
  export let freeze = false;

  let liveDataPoint: Vector3 = { x: 0, y: 0, z: 0 };

  const smoothedLiveData = new SmoothedLiveData(liveAccelerometerData, 3);

  $: {
    if (!freeze) {
      liveDataPoint = $smoothedLiveData;
    }
  }
</script>

<View3D {smoothing} {width} {height} dataPoint={liveDataPoint} />

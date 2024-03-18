<!-- (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import { liveCombinedData, liveAccelerometerData, liveMagnetometerData } from '../../script/stores/Stores';
  import LiveGraph from './LiveGraph.svelte';
  import LiveData from '../../script/domain/stores/LiveData'

  export let width: number;
</script>

<LiveGraph
  minValue={StaticConfiguration.liveGraphValueBounds.min}
  maxValue={StaticConfiguration.liveGraphValueBounds.max}
  liveData={liveCombinedData}
  {width} />

  
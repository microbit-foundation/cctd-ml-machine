<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
    import { liveAccelerometerData } from "../../script/stores/Stores";
    import LiveGraph from "./LiveGraph.svelte";

    export let width: number;
</script>

 <LiveGraph minValue={-2} maxValue={2.3} liveData={liveAccelerometerData} width={width}/>
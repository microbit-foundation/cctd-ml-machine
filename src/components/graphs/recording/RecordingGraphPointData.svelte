<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import StaticConfiguration from '../../../StaticConfiguration';
  import FixedNumber from '../../base/FixedNumber.svelte';

  export let data: { x: number; y: number; z: number };
</script>

<span>
  <span class="mr-1" style="color: {StaticConfiguration.liveGraphColors[0]};"
    ><FixedNumber digits={2} number={data.x} /></span>
  <span class="mr-1" style="color: {StaticConfiguration.liveGraphColors[1]};"
    ><FixedNumber digits={2} number={data.y} /></span>
  <span style="color: {StaticConfiguration.liveGraphColors[2]};"
    ><FixedNumber digits={2} number={data.z} /></span>
</span>

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import StaticConfiguration from '../../../StaticConfiguration';
  import FixedNumber from '../../base/FixedNumber.svelte';

  export let sample: number[];
</script>

<span>
  {#each sample as sampleValue, idx}
    <span class="mr-1" style="color: {StaticConfiguration.graphColors[idx]};">
      <FixedNumber digits={2} number={sampleValue} />
    </span>
  {/each}
</span>

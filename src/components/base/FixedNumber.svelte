<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  export let number: number;
  export let digits: number;

  const isNegative = number < 0;
  const fixed = Math.abs(number).toFixed(digits);
</script>

<span>
  <div class="inline-flex w-2">
    {#if isNegative}
      -
    {/if}
  </div>
  {fixed}
</span>

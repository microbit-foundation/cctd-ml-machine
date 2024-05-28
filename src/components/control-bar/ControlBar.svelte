<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  export let expanded: boolean = false;
</script>

<div
  class="min-h-12 h-12 flex w-full items-center bg-backgroundlight shadow-md"
  class:px-2={!expanded}>
  <slot />
</div>

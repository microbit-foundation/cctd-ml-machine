<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import ValidationPageControlBar from './validation/ValidationPageControlBar.svelte';
  import ValidationPageMainContent from './validation/ValidationPageMainContent.svelte';
</script>

<!-- Main pane -->
<main class="min-w-full flex flex-col max-w-full min-h-full">
  <div>
    <ValidationPageControlBar />
  </div>
  <div class="overflow-x-auto flex-grow">
    <ValidationPageMainContent />
  </div>
</main>

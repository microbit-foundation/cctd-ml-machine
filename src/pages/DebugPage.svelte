<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { getControllers } from '../backend/interface-adapter/MLMachine';

  onMount(() => {
    const controllers = getControllers();
    console.log(controllers.getAppController().isReconnectFlagSet());
    if (!controllers.getAppController().isReconnectFlagSet()) {
      controllers.getAppController().setReconnectFlag(true);
    }
  });
</script>

<div class="flex flex-row justify-center h-full">
  <div class="flex flex-col justify-center">
    <h1>Debug Page</h1>
  </div>
</div>

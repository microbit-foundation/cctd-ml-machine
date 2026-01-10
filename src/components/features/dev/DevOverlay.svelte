<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import Environment from '../../../core/Environment';

  const inDev = Environment.isInDevelopment;
  const controllers = getControllers();
  const microbitController = controllers.getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
</script>

{#if inDev}
  <div
    class="absolute bottom-3 left-3 bg-transparent justify-center self-center items-center z-4"
    style="pointer-events: none;"
    aria-hidden="true">
    <div class="text-sm text-violet-700 bg-white p-2">
      <p><span>WasCancelled</span>: {$microbitConnection.wasDeviceRequestCancelled()}</p>
      {#each [$microbitConnection.getInput(), $microbitConnection.getInput()] as connection, idx}
        <p><span>{idx === 0 ? 'Input' : 'Output'}-Ready</span>: {connection.isReady()}</p>
        <p>
          <span>{idx === 0 ? 'Input' : 'Output'}-Connected</span>: {connection.isConnected()}
        </p>
        <p>
          <span>{idx === 0 ? 'Input' : 'Output'}-Assigned</span>: {connection.isAssigned()}
        </p>
        <p>
          <span>{idx === 0 ? 'Input' : 'Output'}-Initializing</span>: {connection.isInitializing()}
        </p>
      {/each}
    </div>
  </div>
{/if}

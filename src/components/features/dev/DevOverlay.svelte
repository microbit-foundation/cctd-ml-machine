<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
    import { ClassifierController } from '../../../backend/interface-controller/ClassifierController';
  import Environment from '../../../core/Environment';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import NeuralNetworkArchitectureDebug from './NeuralNetworkArchitectureDebug.svelte';

  const inDev = Environment.isInDevelopment;
  const controllers = getControllers();
  const classifierController = controllers.getClassifierController();
  const microbitController = controllers.getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();

  let outp = Microbits.getOutput().getDevice()?.getId();
  let inp = Microbits.getInput().getDevice()?.getId();
  const test = () => {
    outp = Microbits.getOutput().getDevice()?.getId();
    inp = Microbits.getInput().getDevice()?.getId();
  };
  const liveData = controllers.getDataController().getLiveData();
  let liveDataUpdateCount = 0;
  liveData.subscribe(() => {
    liveDataUpdateCount++;
  });
  const recState = getControllers().getRecordingController().getRecordingState();
  const filterController = controllers.getFilterController();
  const filters = filterController.getFilters();
  const nnController = controllers.getNeuralNetworkController();
  const neuralNetworkSettings = nnController.getNeuralNetworkSettings();
  const prediction = classifierController.getPrediction();
  const engineController = controllers.getEngineController();
</script>

<style>
  button {
    border: 2px solid black;
    padding: 8px;
  }
</style>

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
      <div class="pointer-events-auto">
        <button on:click={test}>button</button>
        <p>input:{inp}</p>
        <p>output:{outp}</p>
        <p>
          LiveData: {$liveData
            .getBuffer()
            .getNewestValue()
            ?.getValue()
            .map(e => e.toFixed(2))}
        </p>
        <p>LD-Updates: {liveDataUpdateCount}</p>
        <p>Rec: {$recState.isRecording()}</p>
        <NeuralNetworkArchitectureDebug settings={$neuralNetworkSettings} />
        <p>Prediction: {$prediction?.getPrediction().round(1).getValue()}</p>
        <div class="flex flex-row gap-2">
        <p class="self-center">Engine:</p>
          <button on:click={() => engineController.startPollingPredictorEngine()}>Start</button>
          <button on:click={() => engineController.stopPollingPredictorEngine()}>Stop</button>
        </div>
      </div>
    </div>
  </div>
{/if}

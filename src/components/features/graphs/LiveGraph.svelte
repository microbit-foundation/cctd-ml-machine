<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import DimensionLabels from './DimensionLabels.svelte';
  import type { LiveDataVector } from '../../../core/vector/LiveDataVector';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import type { LiveDataStore } from '../../../core/LiveDataStore';
  import type { AbstractState } from '../../../backend/statemanagement/AbstractState';
  import { LiveGraphControl } from './LiveGraph';

  // Updates width to ensure that the canvas fills the whole screen
  export let width: number;
  export let liveData: AbstractState<LiveDataStore<LiveDataVector>>;
  export let maxValue: number;
  export let minValue: number;

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
  const recordingState = getControllers().getRecordingController().getRecordingState();
  const recordingSettings = getControllers()
    .getRecordingController()
    .getRecordingSettings();
  const selectedAxes = getControllers().getDataController().getSelectedAxes();

  let canvas: HTMLCanvasElement | undefined = undefined;

  const control = new LiveGraphControl(
    minValue,
    maxValue,
    $recordingSettings.getRecordingDuration(),
    liveData,
  );

  onMount(() => {
    if (canvas) {
      control.setCanvas(canvas, $selectedAxes);
    }
    return () => {
      control.stop();
    };
  });

  $: if ($recordingState.isRecording()) {
    control.recordingStarted();
  }

  $: if (canvas && $selectedAxes) {
    control.setCanvas(canvas, $selectedAxes);
  }
</script>

<main class="flex">
  <canvas bind:this={canvas} height="160" width={width - 30} />
  <DimensionLabels
    hidden={!$microbitConnection.getInput().isConnected()}
    {minValue}
    graphHeight={160}
    {maxValue}
    liveData={control.getSmoothedLiveData()} />
</main>

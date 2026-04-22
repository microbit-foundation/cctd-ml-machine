<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import TrainModelFirstTitle from '../../../components/features/model/TrainModelFirstTitle.svelte';
  import ModelPageStackViewContent from './ModelPageStackViewContent.svelte';
  import PleaseConnect from '../../../components/features/PleaseConnect.svelte';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();

  const classifierController = getControllers().getClassifierController();
  const modelTraining = classifierController.getModelTraining();
  // In case of manual classification, variables for evaluation

  onMount(() => {
    Microbits.resetIOPins();
  });

</script>

<!-- Main pane -->
<main class="h-full flex flex-col">
  {#if $modelTraining.hasPendingSettings()}
    {#if $microbitConnection.getInput().isReady()}
      <ModelPageStackViewContent />
    {:else}
      <PleaseConnect />
    {/if}
  {:else}
    <TrainModelFirstTitle />
  {/if}
</main>

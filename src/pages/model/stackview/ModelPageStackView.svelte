<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import TrainModelFirstTitle from '../../../components/features/model/TrainModelFirstTitle.svelte';
  import ModelPageStackViewContent from './ModelPageStackViewContent.svelte';
  import { stores } from '../../../lib/stores/Stores';
  import PleaseConnect from '../../../components/features/PleaseConnect.svelte';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';


  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
  const classifier = stores.getClassifier();
  // In case of manual classification, variables for evaluation

  onMount(() => {
    Microbits.resetIOPins();
  });

  const model = classifier.getModel();
</script>

<!-- Main pane -->
<main class="h-full flex flex-col">
  {#if $model.isTrained}
    {#if $microbitConnection.getInput().isReady()}
      <ModelPageStackViewContent />
    {:else}
      <PleaseConnect />
    {/if}
  {:else}
    <TrainModelFirstTitle />
  {/if}
</main>

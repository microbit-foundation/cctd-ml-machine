<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { state } from '../../script/stores/uiStore';
  import TrainingFailedDialog from './TrainingFailedDialog.svelte';
  import { stores } from '../../script/stores/Stores';
  import TrainingPageTabs from './TrainingPageTabs.svelte';
  import TrainingPageModelView from './TrainingPageModelView.svelte';
  import InsufficientData from './InsufficientData.svelte';
  import PleaseConnect from '../../components/PleaseConnect.svelte';

  const gestures = stores.getGestures();
  const sufficientData = gestures.hasSufficientData();
</script>

<TrainingFailedDialog />
<div class="flex flex-col h-full">
  <TrainingPageTabs />
  {#if !sufficientData}
    <InsufficientData />
  {:else}
    <TrainingPageModelView />
  {/if}
  {#if !$state.isInputConnected}
    <div class="mt-5">
      <PleaseConnect />
    </div>
  {/if}
</div>

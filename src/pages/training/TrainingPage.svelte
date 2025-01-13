<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import TrainingFailedDialog from './TrainingFailedDialog.svelte';
  import { state, stores } from '../../script/stores/Stores';
  import TrainingPageModelView from './TrainingPageModelView.svelte';
  import InsufficientData from './InsufficientData.svelte';
  import PleaseConnect from '../../components/PleaseConnect.svelte';
  import TrainingPageTabs from './controlbar/TrainingPageTabs.svelte';

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
</div>

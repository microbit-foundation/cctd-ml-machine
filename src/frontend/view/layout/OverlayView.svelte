<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<!-- Use as a container for items that are supposed to be at the top of the DOM. -->
<script lang="ts">
  import { fade } from 'svelte/transition';
  import ReconnectPrompt from '../../ReconnectPrompt.svelte';
  import { message } from '../../lib/stores/uiStore';
  import { isInputPatternValid } from '../../lib/stores/connectionStore';
  import FilterListFilterPreview from '../../filters/FilterListFilterPreview.svelte';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import DevOverlay from '../../dev/DevOverlay.svelte';
  import MicrobitFlashingProgressOverlay from '../../microbit-flashing/MicrobitFlashingProgressOverlay.svelte';
  import OutdatedMicrobitWarning from '../../OutdatedMicrobitWarning.svelte';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
  // Helps show error messages on top of page
  let latestMessage = '';
  let showLatestMessage = false;
  let latestMessageTimeout: NodeJS.Timeout;

  // In case of a message. Show the message at the top of screen
  // After 3 seconds. Hide the message again
  $: showMessage($message);

  function showMessage(msg: { warning: boolean; text: string }): void {
    if (!msg.warning) {
      return;
    }

    latestMessage = msg.text;
    showLatestMessage = true;

    if (latestMessageTimeout) {
      clearTimeout(latestMessageTimeout);
    }
    latestMessageTimeout = setTimeout(() => {
      showLatestMessage = false;
    }, 3000);
  }
</script>

<div>
  {#if showLatestMessage}
    <div transition:fade class="absolute mt-2 w-full z-100 textAnimation">
      <div class="flex justify-center">
        <p
          class="text-red-600 text-center shadow-lg text-2xl m-2 p-5 w-max bg-white rounded-xl border border-solid border-warm-gray-400">
          {latestMessage}
        </p>
      </div>
    </div>
  {/if}
  {#if $microbitConnection
    .getReconnectState()
    .isOfferingReconnect() && isInputPatternValid()}
    <ReconnectPrompt />
  {/if}
  {#if $microbitConnection.getInput().isOutdated() || $microbitConnection
      .getOutput()
      .isOutdated()}
    <OutdatedMicrobitWarning
      targetRole={$microbitConnection.getInput().isOutdated() ? 'INPUT' : 'OUTPUT'} />
  {/if}
  <FilterListFilterPreview />
  <MicrobitFlashingProgressOverlay />
  <DevOverlay />
</div>

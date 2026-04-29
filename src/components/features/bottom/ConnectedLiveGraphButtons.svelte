<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import { tr } from '../../../i18n';
  import TypingUtils from '../../../lib/TypingUtils';
  import StandardButton from '../../ui/buttons/StandardButton.svelte';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();

  export let onOutputDisconnectButtonClicked: () => void;
  export let onOutputConnectButtonClicked: () => void;
  export let onInputDisconnectButtonClicked: () => void;

const modelTraining = getControllers().getClassifierController().getModelTraining();
const classifier = getControllers().getClassifierController().getClassifier();
</script>

<!-- These are the buttons that are present while the input micro:bit is connected-->
<div class="flex flex-row mr-4">
  {#if !!$classifier || $modelTraining.isTraining() || $microbitConnection
      .getOutput()
      .isConnected()}
    {#if $microbitConnection.getOutput().isAssigned()}
      <!-- Output is assigned -->
      {#if !$microbitConnection.getOutput().isConnected() || $microbitConnection
          .getOutput()
          .isReady()}
        <!-- Output MB is not in the connection process -->
        <StandardButton medium onClick={onOutputDisconnectButtonClicked} color="warning">
          {$tr('menu.model.disconnect')}
        </StandardButton>
      {:else}
        <!-- svelte-ignore missing-declaration -->
        <StandardButton medium onClick={TypingUtils.emptyFunction} color="disabled">
          <img alt="loading" src="imgs/loadingspinner.gif" style="height:24px" />
        </StandardButton>
      {/if}
    {:else}
      <StandardButton medium onClick={onOutputConnectButtonClicked}>
        {$tr('menu.model.connectOutputButton')}
      </StandardButton>
    {/if}
  {/if}
  <div class="ml-2">
    {#if !$microbitConnection.getInput().isConnected() || $microbitConnection
        .getInput()
        .isReady()}
      <!-- Input MB is not in the connection process -->
      <StandardButton medium onClick={onInputDisconnectButtonClicked} color="warning"
        >{$tr('footer.disconnectButton')}</StandardButton>
    {:else}
      <StandardButton medium onClick={TypingUtils.emptyFunction} color="disabled">
        <img alt="loading" src="/imgs/loadingspinner.gif" style="height:24px" />
      </StandardButton>
    {/if}
  </div>
</div>

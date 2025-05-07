<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { tr } from '../../../i18n';
  import { state, stores } from '../../../lib/stores/Stores';
  import TypingUtils from '../../../lib/TypingUtils';
  import StandardButton from '../../ui/buttons/StandardButton.svelte';

  export let onOutputDisconnectButtonClicked: () => void;
  export let onOutputConnectButtonClicked: () => void;
  export let onInputDisconnectButtonClicked: () => void;

  const model = stores.getClassifier().getModel();
</script>

<!-- These are the buttons that are present while the input micro:bit is connected-->
<div class="flex flex-row mr-4">
  {#if $model.hasModel || $model.isTraining || $state.isOutputConnected}
    {#if $state.isOutputAssigned}
      <!-- Output is assigned -->
      {#if !$state.isOutputConnected || $state.isOutputReady}
        <!-- Output MB is not in the connection process -->
        <StandardButton onClick={onOutputDisconnectButtonClicked} color="warning">
          {$tr('menu.model.disconnect')}
        </StandardButton>
      {:else}
        <!-- svelte-ignore missing-declaration -->
        <StandardButton onClick={TypingUtils.emptyFunction} color="disabled">
          <img alt="loading" src="imgs/loadingspinner.gif" style="height:24px" />
        </StandardButton>
      {/if}
    {:else}
      <StandardButton onClick={onOutputConnectButtonClicked}>
        {$tr('menu.model.connectOutputButton')}
      </StandardButton>
    {/if}
  {/if}
  <div class="ml-2">
    {#if !$state.isInputConnected || $state.isInputReady}
      <!-- Input MB is not in the connection process -->
      <StandardButton onClick={onInputDisconnectButtonClicked} color="warning"
        >{$tr('footer.disconnectButton')}</StandardButton>
    {:else}
      <StandardButton onClick={TypingUtils.emptyFunction} color="disabled">
        <img alt="loading" src="/imgs/loadingspinner.gif" style="height:24px" />
      </StandardButton>
    {/if}
  </div>
</div>

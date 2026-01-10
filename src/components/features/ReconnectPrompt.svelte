<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { horizontalSlide } from '../../lib/transitions';
  import { t } from '../../i18n';
  import { btPatternInput, btPatternOutput } from '../../lib/stores/connectionStore';
  import Microbits from '../../lib/microbit-interfacing/Microbits';
  import { MBSpecs } from 'microbyte';
  import StandardButton from '../ui/buttons/StandardButton.svelte';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import { MicrobitRole } from '../../backend/domain/microbit/MicrobitRole';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();

  let reconnectText: string;
  let reconnectButtonText: string;
  microbitConnection.subscribe(s => {
    // Read reconnect state from the connection object
    const reconnectState = s.getReconnectState();
    const role = reconnectState?.getMicrobitRole();
    if (role === MicrobitRole.INPUT) {
      reconnectText = $t('popup.disconnectedWarning.input');
      reconnectButtonText = $t('popup.disconnectedWarning.reconnectButton.input');
    } else if (role === MicrobitRole.OUTPUT) {
      reconnectText = $t('popup.disconnectedWarning.output');
      reconnectButtonText = $t('popup.disconnectedWarning.reconnectButton.output');
    }
  });
  // When disconnected by lost connection, offer the option to attempt to reconnect
  let hideReconnectMessageAfterTimeout = false;
  microbitConnection.subscribe(s => {
    if (s.getReconnectState().isOfferingReconnect()) {
      hideReconnectMessageAfterTimeout = true;
    }
  });

  const reconnect = (connectState: MicrobitRole) => {
    hideReconnectMessageAfterTimeout = false;
    console.assert(
      microbitConnection.get().getReconnectState().isOfferingReconnect() === true,
    );
    const pairingPattern =
      connectState === MicrobitRole.INPUT ? $btPatternInput : $btPatternOutput;
    const name = MBSpecs.Utility.patternToName(pairingPattern);

    const connect = () => {
      if (connectState == MicrobitRole.INPUT) {
        return Microbits.connectInput(name);
      }
      return Microbits.connectOutput(name);
    };

    void connect().then(() => {
      // Use controller API to clear the reconnect offering
      microbitController.clearReconnectOffering();
    });
  };
</script>

<div
  class="absolute top-8 right-4 bg-white rounded-md p-6 border-1 border-black z-5"
  transition:horizontalSlide>
  <div class="w-100">
    <div class="absolute right-2 top-2 svelte-1rnkjvh">
      <button
        class="hover:bg-gray-100 rounded outline-transparent w-8 svelte-1rnkjvh"
        on:click={() => microbitController.clearReconnectOffering()}>
        <i
          class="fas fa-plus text-lg text-gray-600 hover:text-gray-800 duration-75 svelte-1rnkjvh"
          style="transform: rotate(45deg);" />
      </button>
    </div>
    <p>{reconnectText}</p>
    <div class="flex justify-center">
      <StandardButton
        onClick={() =>
          reconnect($microbitConnection.getReconnectState().getMicrobitRole())}>
        {reconnectButtonText}
      </StandardButton>
    </div>
  </div>
</div>

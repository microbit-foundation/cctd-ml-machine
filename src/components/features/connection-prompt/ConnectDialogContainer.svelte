<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardDialog from '../../ui/dialogs/StandardDialog.svelte';
  import BluetoothConnectDialog from './bluetooth/BluetoothConnectDialog.svelte';
  import StartDialog from './StartDialog.svelte';
  import DoneDownloadingDialog from './usb/DoneDownloadingDialog.svelte';
  import DownloadingDialog from './usb/DownloadingDialog.svelte';
  import FindUsbDialog from './usb/FindUsbDialog.svelte';
  import ManualInstallTutorial from './usb/manual/ManualInstallTutorial.svelte';
  import {
    ConnectDialogStates,
    connectionDialogState,
  } from '../../../lib/stores/connectDialogStore';
  import ConnectSameDialog from './ConnectSameDialog.svelte';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import { btPatternInput, btPatternOutput } from '../../../lib/stores/connectionStore';
  import BrokenFirmwareDetected from './usb/BrokenFirmwareDetected.svelte';
  import { MBSpecs } from 'microbyte';
  import { DeviceRequestStates } from '../../../lib/stores/applicationState';

  let flashProgress = 0;

  function onFoundUsbDevice() {
    Microbits.getLinkedFriendlyName()
      .then(friendlyName => {
        // Find the name of the micro:bit
        if ($connectionDialogState.deviceState === DeviceRequestStates.OUTPUT) {
          btPatternOutput.set(MBSpecs.Utility.nameToPattern(friendlyName));
        } else {
          btPatternInput.set(MBSpecs.Utility.nameToPattern(friendlyName));
        }

        Microbits.flashHexToLinked(progress => {
          // Flash hex
          // Send users to download screen
          if (
            $connectionDialogState.connectionState != ConnectDialogStates.USB_DOWNLOADING
          ) {
            $connectionDialogState.connectionState = ConnectDialogStates.USB_DOWNLOADING;
          }
          flashProgress = progress;
        })
          .then(() => {
            // Finished flashing successfully
            $connectionDialogState.connectionState = ConnectDialogStates.USB_DONE;
          })
          .catch(() => {
            // Error during flashing process
            $connectionDialogState.connectionState = ConnectDialogStates.MANUAL_TUTORIAL;
          });
      })
      .catch((e: Error) => {
        // Couldn't find name. Set to manual transfer progress instead
        $connectionDialogState.connectionState = ConnectDialogStates.MANUAL_TUTORIAL;
      });
  }

  function connectSame() {
    Microbits.useInputAsOutput();
    $connectionDialogState.connectionState = ConnectDialogStates.NONE;
  }
</script>

<main>
  <StandardDialog
    isOpen={$connectionDialogState.connectionState !== ConnectDialogStates.NONE}
    onClose={() => ($connectionDialogState.connectionState = ConnectDialogStates.NONE)}>
    {#if $connectionDialogState.connectionState === ConnectDialogStates.START}
      <StartDialog
        onStartBluetoothClick={() =>
          ($connectionDialogState.connectionState = ConnectDialogStates.BLUETOOTH)}
        onStartUsbClick={() =>
          ($connectionDialogState.connectionState = ConnectDialogStates.USB_START)} />
    {:else if $connectionDialogState.connectionState === ConnectDialogStates.START_OUTPUT}
      <ConnectSameDialog
        onConnectSameClick={connectSame}
        onConnectDifferentClick={() =>
          ($connectionDialogState.connectionState = ConnectDialogStates.START)} />
    {:else if $connectionDialogState.connectionState === ConnectDialogStates.BLUETOOTH}
      <BluetoothConnectDialog
        onBluetoothConnected={() => {
          $connectionDialogState.connectionState = ConnectDialogStates.NONE;
        }}
        deviceState={$connectionDialogState.deviceState} />
    {:else if $connectionDialogState.connectionState === ConnectDialogStates.USB_START}
      <FindUsbDialog
        manualDownloadClick={() => {
          $connectionDialogState.connectionState = ConnectDialogStates.MANUAL_TUTORIAL;
        }}
        onFoundUsb={onFoundUsbDevice} />
    {:else if $connectionDialogState.connectionState === ConnectDialogStates.BAD_FIRMWARE}
      <BrokenFirmwareDetected />
    {:else if $connectionDialogState.connectionState === ConnectDialogStates.USB_DOWNLOADING}
      <DownloadingDialog transferProgress={flashProgress} />
    {:else if $connectionDialogState.connectionState === ConnectDialogStates.USB_DONE}
      <DoneDownloadingDialog
        onConnectBluetoothClick={() =>
          ($connectionDialogState.connectionState = ConnectDialogStates.BLUETOOTH)} />
    {:else if $connectionDialogState.connectionState === ConnectDialogStates.MANUAL_TUTORIAL}
      <ManualInstallTutorial
        onConnectBluetoothClick={() =>
          ($connectionDialogState.connectionState = ConnectDialogStates.BLUETOOTH)} />
    {/if}
  </StandardDialog>
</main>

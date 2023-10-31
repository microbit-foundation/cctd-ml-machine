<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../StandardButton.svelte';
  import { t } from '../../i18n';

  export let onStartUsbClick: () => void;
  export let onStartBluetoothClick: () => void;

  let myColor = "blue-800"

  let selection: "usb" | "bluetooth" | undefined = undefined;

  function handleClick() {
    if (selection === "bluetooth") {
      onStartBluetoothClick();
    }
    else if (selection === "usb") {
      onStartUsbClick();
    }
  }
</script>

<style>
  .selected {
    border-color: rgb(53, 214, 0);
    border-width: 5px;
  }
</style>

<main>
  <div class="leading-10 pb-5">
    <p class="font-bold text-2xl text-left">
      {$t('connectMB.main.header')}
    </p>
    <p>{$t('connectMB.main.clarification1')}</p>
    <p>{$t('connectMB.main.clarification2')}</p>
  </div>
  <div class="grid grid-cols-2 w-600px text-center pb-5">
    <div
      class="{ selection === 'usb' ? 'selected' :'' } hover:cursor-pointer hover:shadow-lg mr-2 border-gray-400 border-2 rounded-lg p-6"
      on:click={() => selection = "usb"}>
      <h1 class="font-bold">
        {$t('connectMB.main.usbHeader')}
      </h1>
      <p class="mb-5">
        {$t('connectMB.main.usbBody')}
      </p>
      <img alt="PLACEHOLDER" />
    </div>
    <div
      class="{ selection === 'bluetooth' ? 'selected' : '' } hover:cursor-pointer hover:shadow-lg mr-2 border-gray-400 border-2 rounded-lg p-6"
      on:click={() => selection = "bluetooth"}>
      <h1 class="font-bold">
        {$t('connectMB.main.btHeader')}
      </h1>
      <p class="mb-5">
        {$t('connectMB.main.btBody')}
      </p>
      <img alt="PLACEHOLDER" />
    </div>
  </div>
  <StandardButton position="right" onClick={handleClick}>{$t('connectMB.main.nextButton')}</StandardButton>
</main>

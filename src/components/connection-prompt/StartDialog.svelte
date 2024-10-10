<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../buttons/StandardButton.svelte';
  import { t } from '../../i18n';

  export let onStartUsbClick: () => void;
  export let onStartBluetoothClick: () => void;
</script>

<main>
  <div class="grid grid-cols-2 w-600px text-center">
    <div
      class="hover:cursor-pointer mr-2 border-gray-200
             border border-solid rounded-lg p-6 shadow-lg"
      on:click={onStartUsbClick}>
      <h1 class="font-bold">
        {$t('connectMB.main.usbHeader')}
      </h1>
      <p class="mb-5">
        {$t('connectMB.main.usbBody')}
      </p>
      <StandardButton>{$t('connectMB.main.installButton')}</StandardButton>
    </div>
    <div
      class="hover:cursor-pointer ml-2 border-gray-200 border border-solid rounded-lg p-6 shadow-lg"
      on:click={onStartBluetoothClick}>
      <h1 class="font-bold">
        {$t('connectMB.main.btHeader')}
      </h1>
      <p class="mb-5">
        {$t('connectMB.main.btBody')}
      </p>
      <StandardButton>{$t('connectMB.main.connectButton')}</StandardButton>
    </div>
  </div>
</main>

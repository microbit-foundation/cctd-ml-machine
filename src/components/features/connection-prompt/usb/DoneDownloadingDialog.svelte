<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../../../i18n';
  import StandardButton from '../../../ui/buttons/StandardButton.svelte';

  export let onConnectBluetoothClick: () => void;
</script>

<main>
  <div class="w-600px text-left">
    <h1 class="font-bold mb-5 text-center">
      {$t('connectMB.usb.header')}
    </h1>
    <p class="font-bold text-center">
      {$t('connectMB.usb.done.body1')}
    </p>
    <p class="mb-3 mt-2">
      {$t('connectMB.usb.done.body2')}
    </p>
    <p class="mb-3">
      {$t('connectMB.usb.done.body3')}
    </p>
    <p class="mb-5 w-70%">
      {$t('connectMB.usb.done.body4')}
    </p>
    <div class="flex flex-row justify-center">
      <StandardButton onClick={onConnectBluetoothClick}>
        {$t('popup.connectMB.main.bluetooth.subtitle')}
      </StandardButton>
    </div>
  </div>
</main>

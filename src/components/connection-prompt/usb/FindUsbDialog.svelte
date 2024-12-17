<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../buttons/StandardButton.svelte';
  import { t } from '../../../i18n';
  import Microbits from '../../../script/microbit-interfacing/Microbits';

  export let onFoundUsb: () => void;
  export let manualDownloadClick: () => void;
  let retryUsb = false;

  function onFindUsbClick() {
    Microbits.linkMicrobit()
      .then(() => onFoundUsb())
      .catch((e: Error) => {
        retryUsb = true;
        console.log(e);
      });
  }

  let step = 1;
</script>

<main>
  <div class="w-500px text-center">
    <h1 class="font-bold mb-5">
      {$t('connectMB.usb.header')}
    </h1>
  </div>
  <div>
    <div class="mb-5">
      {#if step === 1}
        <p>
          {$t('connectMB.usb.body1')}
        </p>
      {/if}
      {#if step === 2}
        <p>
          {$t('connectMB.usb.body2')}
        </p>
        {#if retryUsb}
          <p class="mt-2 text-red-400">
            {$t('connectMB.usb.retry1')}
          <span on:click={manualDownloadClick} class="hover:cursor-pointer text-red-500 underline">
            {$t('connectMB.usb.retryLink')}
          </span>
            {$t('connectMB.usb.retry2')}
          </p>
        {/if}
      {/if}
    </div>
    <div class="flex justify-center">
      <StandardButton
        onClick={step === 2
          ? onFindUsbClick
          : () => {
              step = 2;
            }}>
        {$t(step === 1 ? 'connectMB.usb.button1' : 'connectMB.usb.button2')}
      </StandardButton>
    </div>
  </div>
</main>

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../../../i18n';
  import { onMount } from 'svelte';
  import StandardButton from '../../../buttons/StandardButton.svelte';
  import Microbits from '../../../../script/microbit-interfacing/Microbits';
  import ImageSkeleton from '../../../skeletonloading/ImageSkeleton.svelte';
  import Bowser from 'bowser';

  export let onConnectBluetoothClick: () => void;

  onMount(() => Microbits.downloadFirmware());

  const browser = Bowser.getParser(window.navigator.userAgent);
  const osName = browser.getOS().name ?? 'unknown';

  // See https://github.com/lancedikson/bowser/blob/master/src/constants.js
  const getIllustrationGif = (os: string) => {
    switch (os) {
      case 'Chrome OS':
        return 'imgs/transfer_firmware_chromeos.gif';
      case 'Windows':
        return 'imgs/transfer_firmware_windows.gif';
      case 'macOS':
        return 'imgs/transfer_firmware_macos.gif';
      default:
        return 'imgs/transfer_firmware_macos.gif';
    }
  };

  const transferIllustration = getIllustrationGif(osName);
</script>

<main>
  <h1 class="mb-5 font-bold">
    {$t('connectMB.usb.manual.header')}
  </h1>
  <div class="flex float-left mb-3">
    <p class="mr-1">
      {$t('connectMB.usb.manual.manualDownload')}
    </p>
    <p
      class="hover:cursor-pointer text-red-500 underline"
      on:click={() => Microbits.downloadFirmware()}>
      {$t('connectMB.usb.manual.manualDownloadLink')}
    </p>
  </div>
  <div class="grid grid-cols-3 mb-5 w-900px">
    <div class="col-span-2">
      <p>1. {$t('popup.connectMB.USBCompatibility.transferStep.step1')}</p>
      <p>2. {$t('popup.connectMB.USBCompatibility.transferStep.step2')}</p>
      <p>3. {$t('popup.connectMB.USBCompatibility.transferStep.step3')}</p>
    </div>
    <div>
      <div class="">
        <ImageSkeleton
          alt="Transferring the firmware"
          castShadow
          height={104}
          src={transferIllustration}
          width={290} />
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 place-items-center w-full">
    <StandardButton onClick={onConnectBluetoothClick}
      >{$t('connectMB.usb.manual.done')}</StandardButton>
  </div>
</main>

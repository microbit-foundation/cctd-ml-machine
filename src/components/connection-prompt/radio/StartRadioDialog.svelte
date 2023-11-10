<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

 <script lang="ts">
    import StandardButton from '../../StandardButton.svelte';
    import { t } from '../../../i18n';
  
    export let onNextClick: () => void;
    export let onStartBluetoothClick: () => void;
  </script>

  <main>
    <div class="w-200">
      <p class="font-bold pb-10 text-2xl text-left">{$t('connectMB.radioStart.heading')}</p>
      <div class="inline-grid grid-cols-3 gap-20 py-20 px-10">
        <div>
            <img src="" alt="PLACEHOLDER" />
            <p class="pt-10 text-center font-bold">{$t('connectMB.radioStart.requirements1')}</p>
        </div>
        <div>
            <img src="" alt="PLACEHOLDER" />
            <p class="pt-10 text-center font-bold">{$t('connectMB.radioStart.requirements2')}</p>
        </div>
        <div>
            <img src="" alt="PLACEHOLDER" />
            <p class="pt-10 text-center font-bold">{$t('connectMB.radioStart.requirements3')}</p>
        </div>
    </div>
  </div>
    <div class="flex items-center w-full">
        <div on:click={onStartBluetoothClick} class="w-min-70 hover:cursor-pointer">{$t('connectMB.radioStart.switchBluetooth')}</div>
        <StandardButton extraClasses="basis-full" position="right" onClick={onNextClick}>{$t('connectMB.nextButton')}</StandardButton>
    </div>
  </main>
  
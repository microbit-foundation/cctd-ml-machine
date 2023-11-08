<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

 <script lang="ts">
    import StandardButton from '../../StandardButton.svelte';
    import { t } from '../../../i18n';
  
    export let onNextClick: () => void;
  </script>
  
  <main>
    <div class="w-180 leading-10 pb-5">
      <p class="font-bold text-2xl text-left pb-3">
        {$t('popup.connectMB.connectBattery.heading')}
      </p>
      <p>{$t('popup.connectMB.connectBattery.subtitle')}</p>
      <img src="public/imgs/stylised-microbit-connected.svg" alt="Battery connection diagram" class="px-40 pt-5"/>
    </div>
    <div class="justify-end flex pt-10">
    <StandardButton onClick={onNextClick}>{$t('popup.connectMB.nextButton')}</StandardButton>
    </div>
  </main>
<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->


<script lang="ts">
    import StandardButton from '../../StandardButton.svelte';
    import { t } from '../../../i18n';
  
    export let onNextClick: () => void;
    export let onBackClick: () => void;
  </script>
  
  <main>
    <div class="w-200 leading-10">
      <p class="font-bold text-2xl text-left pb-5">
        {$t("connectMB.connectCable.heading")}
      </p>
      <p class="leading-normal">{$t('connectMB.connectCable.subtitle')}</p>
      <img src="imgs/connect-cable.gif" alt="GIF of connecting micro:bit" class="px-55 py-5"/>
    </div>
    <div class="justify-end flex gap-x-5">
    <StandardButton outlined={true} onClick={onBackClick}>{$t('connectMB.backButton')}</StandardButton>
    <StandardButton onClick={onNextClick}>{$t('connectMB.nextButton')}</StandardButton>
    </div>
  </main>
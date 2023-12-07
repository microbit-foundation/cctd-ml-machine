<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../StandardButton.svelte';
  import { t } from '../../../i18n';
  import Microbits from '../../../script/microbit-interfacing/Microbits';

  export let onBackClick: () => void;
  export let onFound: () => void;
  export let onLinkError: () => void;

  function onNextClick() {
    Microbits.linkMicrobit()
      .then(() => onFound())
      .catch((e: Error) => {
        console.log(e);
        onLinkError();
      });
  }
</script>

<main>
  <div class="w-180 leading-10 pb-5">
    <h2 class="font-bold text-2xl">
      {$t('connectMB.webPopup')}
    </h2>
    <div class="flex mt-5">
      <img
      src="/imgs/select-microbit.png"
      alt="Screenshot of the browser window that will appear next.  Your connected micro:bit will be listed. Choose your micro:bit then select the Connect button."
      />
      <div class="flex flex-col w-full px-5">
        <h3 class="font-bold text-lg mb-5">{$t('connectMB.webPopup.instruction.heading')}:</h3>
        <ol class="list-decimal list-inside">
          <li>{$t('connectMB.webPopup.instruction1')}</li>
          <li>{$t('connectMB.webPopup.instruction2')}</li>
        </ol>
      </div>
    </div>
  </div>
  <div class="justify-end flex flex-space-10 gap-x-5">
    <StandardButton position="right" onClick={onBackClick}
      >{$t('connectMB.backButton')}</StandardButton>
    <StandardButton type="primary" onClick={onNextClick}
      >{$t('connectMB.nextButton')}</StandardButton>
  </div>
</main>

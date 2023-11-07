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
    <div class="w-150 leading-10 pb-5">
      <p class="font-bold text-2xl text-left">
         SELECT MICROBIT FROM WEB POPUP TEMP
      </p>
      <img src="public/imgs/select-microbit.png" alt="Instructions on how to choose microbit from web popup" class="p-20"/>
    </div>
    <div class="justify-end flex flex-space-10 gap-x-5">
    <StandardButton position="right" onClick={onBackClick}>BACK TEMP</StandardButton>
    <StandardButton onClick={onNextClick}>NEXT TEMP</StandardButton>
    </div>
  </main>
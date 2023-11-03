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
    <div class="w-150 leading-10 pb-5">
      <p class="font-bold text-2xl text-left">
        CONNECT CABLE TEMP
      </p>
      <img src="imgs/connect-cable.gif" alt="GIF of connecting micro:bit" class="p-20"/>
    </div>
    <div class="justify-end flex">
    <StandardButton onClick={onBackClick}>BACK TEMP</StandardButton>
    <StandardButton onClick={onNextClick}>NEXT TEMP</StandardButton>
    </div>
  </main>
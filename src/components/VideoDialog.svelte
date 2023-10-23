<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardDialog from './dialogs/StandardDialog.svelte';
  import { t } from '../i18n';
  import { state } from '../script/stores/uiStore';
  import StandardButton from './StandardButton.svelte'

  let isOpen = true;

  export let videoURL: string;
</script>

<StandardDialog {isOpen} onClose={() => (isOpen = false)}>
  <div class="w-150">
    <p class="text-2xl mb-2 font-semibold">
      {$t('content.introductionVideo.heading')}
    </p>
    <div class="flex items-center justify-center">
      <!-- We have selected the video's loading progress as the loading criterion -->
      <video
        on:canplaythrough={() => ($state.isLoading = false)}
        class="w-full"
        controls
        width="550"
        poster="imgs/data-trainer-thumpnail.png">
        <source
          src= {videoURL}
          type="video/mp4" />
      </video>
    </div>
    <p class="pt-5">{$t('content.introductionVideo.description')}</p>
      <StandardButton position="right" onClick={() => isOpen = false}
        >{$t('content.introductionVideo.button')}</StandardButton>
  </div>
</StandardDialog>

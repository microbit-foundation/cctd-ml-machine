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
  $: modalVisibility = isOpen;
  console.log("MODAL VISIBILITY: ", modalVisibility);
</script>

<StandardDialog {isOpen} onClose={() => (isOpen = false)}>
  <div class="w-150">
    <p class="text-2xl mb-2 font-semibold">
      {$t('content.index.videoHeading')}
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
          src="https://datatraener0dr0media-euno.streaming.media.azure.net/18233c69-2bc3-4b1b-9e2d-249e37b56307/Ultrabit_01_Introvideo_Datatræneren.mp4"
          type="video/mp4" />
      </video>
    </div>
    <!-- MARISA: note -> change text for button to 'get started' -->
    <p class="pt-5">TEMPORARY TEXT</p>
    <div class="ml-110">
      <StandardButton onClick={() => isOpen = false}
        >TEMPORARY TEXT</StandardButton>
    </div>
  </div>
</StandardDialog>

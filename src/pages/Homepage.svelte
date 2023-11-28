<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<style>
  .grid-container {
    display: grid;
    gap: 1rem 1rem;
    grid-template-areas:
      'a b'
      'a c';
  }
</style>

<script lang="ts">
  import FrontPageContentTile from '../components/FrontPageContentTile.svelte';
  import StandardButton from '../components/StandardButton.svelte';
  import { t } from '../i18n';
  import { startConnectionProcess } from '../script/stores/connectDialogStore';
  import ConnectDialogContainer from '../components/connection-prompt/ConnectDialogContainer.svelte';

  const introVideoUrl =
    'https://datatraener0dr0media-euno.streaming.media.azure.net/18233c69-2bc3-4b1b-9e2d-249e37b56307/Ultrabit_01_Introvideo_Datatræneren.mp4';

  let connectDialogReference: ConnectDialogContainer;
</script>

<main class="h-full flex flex-col">
  <div>
    <ConnectDialogContainer bind:this={connectDialogReference} />

    <div class="flex flex-col items-center justify-center m-10">
      <video class="w-150 mb-5" controls width="550">
        <source src={introVideoUrl} type="video/mp4" />
      </video>
      <p>{$t('content.index.toolInfo')}</p>
    </div>

    <StandardButton onClick={startConnectionProcess}
      >{$t('footer.connectButtonNotConnected')}</StandardButton>

    <h1 class="ml-10 mt-10 text-2xl">
      {$t('content.index.toolProcessCards.main.title')}
    </h1>
    <div class="grid-container grid-cols-3 min-w-800px p-10 pb-2 pt-2 mt-3">
      <FrontPageContentTile>
        <h2 class="text-center text-xl">
          {$t('content.index.toolProcessCards.data.title')}
        </h2>
      </FrontPageContentTile>
      <FrontPageContentTile>
        <h2 class="text-center text-xl">
          {$t('content.index.toolProcessCards.train.title')}
        </h2>
      </FrontPageContentTile>
      <FrontPageContentTile>
        <h2 class="text-center text-xl">
          {$t('content.index.toolProcessCards.model.title')}
        </h2>
      </FrontPageContentTile>
    </div>
  </div>
</main>

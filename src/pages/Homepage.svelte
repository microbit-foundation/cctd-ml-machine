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
  import { state } from '../script/stores/uiStore';
  import ConnectDialogContainer from '../components/connection-prompt/ConnectDialogContainer.svelte';

  const introVideoUrl =
    'https://datatraener0dr0media-euno.streaming.media.azure.net/18233c69-2bc3-4b1b-9e2d-249e37b56307/Ultrabit_01_Introvideo_Datatræneren.mp4';

  let connectDialogReference: ConnectDialogContainer;

  const connectButtonClicked = () => {
    startConnectionProcess();
  };
</script>

<main class="h-full flex flex-col">
  <div class:hidden={$state.isLoading}>
    <ConnectDialogContainer bind:this={connectDialogReference} />

    <div class="flex flex-col items-center justify-center m-10">
      <video
        on:canplaythrough={() => ($state.isLoading = false)}
        class="w-200 mb-5"
        controls
        width="550">
        <source src={introVideoUrl} type="video/mp4" />
      </video>
      <p>This tool is designed for use with activity 5 in the next gen Playground survey</p>
    </div>

    <StandardButton onClick={connectButtonClicked}
      >{$t('footer.connectButtonNotConnected')}</StandardButton>

    <h1 class="ml-10 mt-10 text-2xl">How to create a model</h1>
    <div class="grid-container grid-cols-3 min-w-800px p-10 pb-2 pt-2 mt-3">
      <FrontPageContentTile>Input data</FrontPageContentTile>
      <FrontPageContentTile>Train model</FrontPageContentTile>
      <FrontPageContentTile>Test model</FrontPageContentTile>
    </div>
  </div>
</main>

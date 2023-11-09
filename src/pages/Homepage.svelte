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

  let connectDialogReference: ConnectDialogContainer;

  const connectButtonClicked = () => {
    startConnectionProcess();
  };
</script>

<main class="h-full flex flex-col">
  <div class:hidden={$state.isLoading}>
    <ConnectDialogContainer bind:this={connectDialogReference} />

    <StandardButton onClick={connectButtonClicked}
      >{$t('footer.connectButtonNotConnected')}</StandardButton>

    <div class="grid-container grid-cols-3 min-w-800px p-10 pb-2 pt-2 mt-3">
      <FrontPageContentTile>Input data</FrontPageContentTile>
      <FrontPageContentTile>Train model</FrontPageContentTile>
      <FrontPageContentTile>Test model</FrontPageContentTile>
    </div>
  </div>
</main>

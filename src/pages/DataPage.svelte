<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import Gesture from '../components/Gesture.svelte';
  import { t } from '../i18n';
  import RecordInformationContent from '../components/datacollection/RecordInformationContent.svelte';
  import StandardDialog from '../components/dialogs/StandardDialog.svelte';
  import MainConnectDialog from '../components/connection-prompt/ConnectDialogContainer.svelte';
  import NewGestureButton from '../components/NewGestureButton.svelte';
  import StandardButton from '../components/buttons/StandardButton.svelte';
  import { startConnectionProcess } from '../script/stores/connectDialogStore';
  import DataPageControlBar from '../components/datacollection/DataPageControlBar.svelte';
  import Information from '../components/information/Information.svelte';
  import { onMount } from 'svelte';
  import FileUtility from '../script/repository/FileUtility';
  import { get } from 'svelte/store';
  import { type GestureData } from '../script/domain/stores/gesture/Gesture';
  import { state, stores } from '../script/stores/Stores';
  import { hasSomeData, importExampleDataset } from './data/DataPage';
  import NoDataPage from './data/DataPageNoData.svelte';
  import DataPageNoData from './data/DataPageNoData.svelte';
  import DataPageWithData from './data/DataPageWithData.svelte';

  const gestures = stores.getGestures();

  const onClearGestures = () => {
    if (confirm($t('content.data.controlbar.button.clearData.confirm'))) {
      gestures.clearGestures();
    }
  };

  const onDownloadGestures = () => {
    FileUtility.downloadDataset(get(gestures));
  };

  const onUploadGestures = () => {
    filePicker.click();
  };

  let filePicker: HTMLInputElement;
  onMount(() => {
    // Todo: Maybe move some of this to the file utility class
    filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.accept = 'application/JSON';
    filePicker.onchange = () => {
      if (filePicker.files == null || filePicker.files.length < 1) {
        return;
      }
      const f = filePicker.files[0];
      FileUtility.loadDatasetFromFile(f);
      filePicker.value = ''; // To trick element to trigger onChange if same file selected
    };
    return () => {
      filePicker.remove();
    };
  });
</script>

<!-- Main pane -->
<main class="min-w-full flex flex-col max-w-full min-h-full">
  <div>
    <DataPageControlBar
      clearDisabled={$gestures.length === 0}
      downloadDisabled={$gestures.length === 0}
      {onClearGestures}
      {onDownloadGestures}
      {onUploadGestures} />
  </div>

  <div class="overflow-x-auto p-2 flex-grow">
    {#if !$hasSomeData}
      {#if !$state.isInputConnected}
        <DataPageNoData />
      {/if}
      <div class="flex flex-grow"></div>
      <div class="flex mt-3 mb-3 justify-center">
        <StandardButton onClick={importExampleDataset}>
          {$t('content.data.noData.templateDataButton')}
        </StandardButton>
      </div>
    {:else}
        <DataPageWithData />
    {/if}
  </div>
</main>

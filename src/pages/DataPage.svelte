<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../i18n';
  import DataPageControlBar from '../components/features/datacollection/DataPageControlBar.svelte';
  import { onMount } from 'svelte';
  import FileUtility from '../lib/repository/FileUtility';
  import { get } from 'svelte/store';
  import { stores } from '../lib/stores/Stores';
  import { hasSomeRecordingData } from './data/DataPage';
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

  <div class="overflow-x-auto p-3 flex-grow flex">
    {#if !$hasSomeRecordingData && !$gestures.length}
      <DataPageNoData />
    {:else}
      <DataPageWithData />
    {/if}
  </div>
</main>

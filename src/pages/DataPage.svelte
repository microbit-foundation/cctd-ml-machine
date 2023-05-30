<script lang="ts">
  import Gesture from '../components/Gesture.svelte';
  import { state } from '../script/stores/uiStore';
  import {
    clearGestures,
    downloadDataset,
    gestures,
    loadDatasetFromFile,
  } from '../script/stores/mlStore';
  import { t } from '../i18n';
  import RecordInformationContent from '../components/datacollection/RecordInformationContent.svelte';
  import StandardDialog from '../components/dialogs/StandardDialog.svelte';
  import MainConnectDialog from '../components/connection-prompt/ConnectDialogContainer.svelte';
  import NewGestureButton from '../components/NewGestureButton.svelte';
  import StandardButton from '../components/StandardButton.svelte';
  import { startConnectionProcess } from '../script/stores/connectDialogStore';
  import PleaseConnectFirst from '../components/PleaseConnectFirst.svelte';
  import DataPageControlBar from '../components/datacollection/DataPageControlBar.svelte';
  import Information from '../components/information/Information.svelte';

  let isConnectionDialogOpen = false;

  $: hasSomeData = (): boolean => {
    if ($gestures.length === 0) {
      return false;
    }
    return $gestures.some(gesture => gesture.recordings.length > 0);
  };

  const onClearGestures = () => {
    if (confirm($t('content.data.controlbar.button.clearData.confirm'))) {
      clearGestures();
    }
  };

  const onDownloadGestures = () => {
    downloadDataset();
  };

  // TODO: Error handling if no files
  const onUploadGestures = (e: Event) => {
    const files = (<HTMLInputElement>e.target).files;
    if (!files) {
      return;
    }
    const file = files[0];
    if (!file) {
      return;
    }
    loadDatasetFromFile(file);
  };

  let connectDialogReference: MainConnectDialog;
</script>

<!-- Main pane -->
<main class="h-full flex flex-col">
  <div>
    <DataPageControlBar
      clearDisabled={$gestures.length === 0}
      downloadDisabled={$gestures.length === 0}
      {onClearGestures}
      {onDownloadGestures}
      {onUploadGestures} />
  </div>
  {#if !hasSomeData() && !$state.isInputConnected}
    <div class="flex flex-col flex-grow justify-center">
      <PleaseConnectFirst />
    </div>
  {:else}
    <div class="mt-4 ml-3">
      <StandardDialog
        isOpen={isConnectionDialogOpen}
        onClose={() => (isConnectionDialogOpen = false)}>
        <div class="w-70 text-center">
          <p class="mb-5">
            {$t('content.data.addDataNoConnection')}
          </p>
          <StandardButton
            onClick={() => {
              isConnectionDialogOpen = false;
              startConnectionProcess();
            }}>{$t('footer.connectButtonNotConnected')}</StandardButton>
        </div>
      </StandardDialog>
      <MainConnectDialog bind:this={connectDialogReference} />

      {#if $gestures.length > 0}
        <div class=" p-0 relative flex h-7">
          <div class="absolute left-3 flex">
            <Information
              isLightTheme={false}
              iconText={$t('content.data.classification')}
              titleText={$t('content.data.classHelpHeader')}
              bodyText={$t('content.data.classHelpBody')} />
          </div>
          <div class="absolute left-55 flex">
            <Information isLightTheme={false} iconText={$t('content.data.choice')}>
              <RecordInformationContent isLightTheme={false} />
            </Information>
          </div>
          {#if hasSomeData()}
            <div class="absolute left-92 flex">
              <Information
                isLightTheme={false}
                iconText={$t('content.data.data')}
                titleText={$t('content.data.data')}
                bodyText={$t('content.data.dataDescription')} />
            </div>
          {/if}
        </div>
      {:else}
        <div class="flex justify-center">
          <div class="text-center text-xl w-1/2 text-bold text-primarytext">
            <p>{$t('content.data.noData')}</p>
          </div>
        </div>
      {/if}
      <!-- Display all gestures -->
      {#each $gestures as gesture (gesture.ID)}
        <Gesture
          bind:gesture
          onNoMicrobitSelect={() => (isConnectionDialogOpen = true)} />
      {/each}
      <NewGestureButton />
    </div>
  {/if}
</main>

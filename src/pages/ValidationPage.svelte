<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardDialog from '../components/dialogs/StandardDialog.svelte';
  import ValidationPageControlBar from './validation/ValidationPageControlBar.svelte';
  import ValidationPageMainContent from './validation/ValidationPageMainContent.svelte';
  import { t } from '../i18n';
  import StandardButton from '../components/buttons/StandardButton.svelte';
  import { startConnectionProcess } from '../script/stores/connectDialogStore';
  import ConnectDialogContainer from '../components/connection-prompt/ConnectDialogContainer.svelte';

  let isConnectionDialogOpen = false;
</script>

<!-- Main pane -->
<main class="min-w-full flex flex-col max-w-full min-h-full">
  <div>
    <ValidationPageControlBar />
  </div>
  <div class="overflow-x-auto flex-grow">
    <ValidationPageMainContent
      onNoMicrobitSelect={() => (isConnectionDialogOpen = true)} />
  </div>

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
        }}>
        {$t('footer.connectButtonNotConnected')}
      </StandardButton>
    </div>
  </StandardDialog>
  <ConnectDialogContainer />
</main>

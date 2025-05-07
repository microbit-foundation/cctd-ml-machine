<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardDialog from '../components/ui/dialogs/StandardDialog.svelte';
  import ValidationPageControlBar from './validation/ValidationPageControlBar.svelte';
  import ValidationPageMainContent from './validation/ValidationPageMainContent.svelte';
  import { t } from '../i18n';
  import { startConnectionProcess } from '../lib/stores/connectDialogStore';
  import ConnectDialogContainer from '../components/connection-prompt/ConnectDialogContainer.svelte';
  import ValidationPageActionContent from './validation/ValidationPageActionContent.svelte';
  import StandardButton from '../components/ui/buttons/StandardButton.svelte';

  let isConnectionDialogOpen = false;
</script>

<!-- Main pane -->
<main class="min-w-full flex flex-col max-w-full min-h-full">
  <div>
    <ValidationPageControlBar />
  </div>
  <div>
    <div
      class="overflow-x-auto flex-grow overflow-y-auto"
      style="height: calc(100vh - 48px - 160px - 152px);">
      <ValidationPageMainContent
        onNoMicrobitSelect={() => (isConnectionDialogOpen = true)} />
    </div>
    <div class="flex-grow h-38">
      <ValidationPageActionContent />
    </div>
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

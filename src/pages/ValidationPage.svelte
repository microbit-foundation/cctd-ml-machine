<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardDialog from '../components/ui/dialogs/StandardDialog.svelte';
  import ValidationPageControlBar from './validation/ValidationPageControlBar.svelte';
  import ValidationPageMainContent from './validation/ValidationPageMainContent.svelte';
  import { t, tr } from '../i18n';
  import { startConnectionProcess } from '../lib/stores/connectDialogStore';
  import ValidationPageActionContent from './validation/ValidationPageActionContent.svelte';
  import StandardButton from '../components/ui/buttons/StandardButton.svelte';
  import ConnectDialogContainer from '../components/features/connection-prompt/ConnectDialogContainer.svelte';
  import Drawer from '../components/ui/drawer/Drawer.svelte';
  import { stores } from '../lib/stores/Stores';
  import ValidationpageActionContentMinimized from './validation/ValidationpageActionContentMinimized.svelte';

  let isConnectionDialogOpen = false;
  let isActionsOpen = false;
</script>

<!-- Main pane -->
<main class="min-w-full flex flex-col max-w-full min-h-full">
  <div>
    <ValidationPageControlBar />
  </div>
  <div>
    <div
      class="overflow-x-auto flex-grow overflow-y-auto"
      style="height: calc(100vh - 48px - 160px - {isActionsOpen
        ? '152px'
        : '32px'}); transition: height 0.3s ease;">
      <ValidationPageMainContent
        onNoMicrobitSelect={() => (isConnectionDialogOpen = true)} />
    </div>
    <div class="flex-grow">
      <Drawer
        isOpen={isActionsOpen}
        className="bg-white"
        onClose={() => (isActionsOpen = false)}
        onOpen={() => (isActionsOpen = true)}
        heightMax="152px"
        heightMin="32px">
        <ValidationPageActionContent slot="open" />
        <ValidationpageActionContentMinimized slot="closed" />
      </Drawer>
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

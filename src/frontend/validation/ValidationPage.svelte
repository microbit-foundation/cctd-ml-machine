<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardDialog from '../components/dialogs/StandardDialog.svelte';
  import ValidationPageControlBar from './ValidationPageControlBar.svelte';
  import ValidationPageMainContent from './ValidationPageMainContent.svelte';
  import { t } from '../../i18n';
  import { startConnectionProcess } from '../lib/stores/connectDialogStore';
  import ValidationPageActionContent from './ValidationPageActionContent.svelte';
  import StandardButton from '../components/buttons/StandardButton.svelte';
  import ConnectDialogContainer from '../connection-prompt/ConnectDialogContainer.svelte';
  import Drawer from '../components/drawer/Drawer.svelte';
  import ValidationpageActionContentMinimized from './ValidationpageActionContentMinimized.svelte';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';

  const controllers = getControllers();
  const validationController = controllers.getValidationController();

  const validationDataset = validationController.getValidationDataset();
  const autoUpdate = validationController.shouldAutoUpdate();
  const classifierController = getControllers().getClassifierController();
  const modelTraining = classifierController.getModelTraining();

  $: {
    if (
      $modelTraining.hasPendingSettings() &&
      $autoUpdate &&
      validationDataset.isValid()
    ) {
      validationController.evaluateValidationSet();
    }
  }

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
        : '36px'}); transition: height 0.3s ease;">
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
        heightMin="36px">
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

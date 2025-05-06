<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import StandardDialog from '../../components/ui/dialogs/StandardDialog.svelte';
  import { startConnectionProcess } from '../../lib/stores/connectDialogStore';
  import { t } from '../../i18n';
  import ConnectDialogContainer from '../../components/connection-prompt/ConnectDialogContainer.svelte';
  import RecordInformationContent from '../../components/datacollection/RecordInformationContent.svelte';
  import Gesture from '../../components/Gesture.svelte';
  import NewGestureButton from '../../components/NewGestureButton.svelte';
  import { stores } from '../../lib/stores/Stores';
  import Information from '../../components/ui/information/Information.svelte';

  let isConnectionDialogOpen = false;
  const gestures = stores.getGestures();
</script>

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

<div class="relative flex h-7">
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
  <div class="absolute left-92 flex">
    <Information
      isLightTheme={false}
      iconText={$t('content.data.data')}
      titleText={$t('content.data.data')}
      bodyText={$t('content.data.dataDescription')} />
  </div>
</div>
<!-- Display all gestures -->
<div class="flex flex-col gap-2 pt-8">
  {#each $gestures as gesture (gesture.ID)}
    <Gesture
      gesture={gestures.getGesture(gesture.ID)}
      onNoMicrobitSelect={() => (isConnectionDialogOpen = true)} />
  {/each}
  <NewGestureButton />
</div>

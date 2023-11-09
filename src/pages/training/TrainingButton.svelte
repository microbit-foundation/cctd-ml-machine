<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { hasSufficientData, state } from '../../script/stores/uiStore';
  import StandardButton from '../../components/StandardButton.svelte';
  import { trainModel } from '../../script/ml';
  import { t } from '../../i18n';
  import StandardDialog from '../../components/dialogs/StandardDialog.svelte';

  const sufficientData = hasSufficientData();
  $: trainButtonLabel = !$state.isPredicting
    ? 'menu.trainer.trainModelButton'
    : 'menu.trainer.trainNewModelButton';

  const trainingButtonDisabled =
    !sufficientData || !$state.isInputConnected || $state.isTraining;
  let trainingDialogOpen = false;

  const closeTrainingDialog = () => {
    trainingDialogOpen = false;
  };

  const startTraining = () => {
    closeTrainingDialog();
    trainModel();
  };
</script>

<StandardButton
  onClick={() => {
    trainingDialogOpen = true;
  }}
  disabled={trainingButtonDisabled}>{$t(trainButtonLabel)}</StandardButton>

<StandardDialog
  isOpen={trainingDialogOpen && !$state.isTraining}
  onClose={closeTrainingDialog}>
  <div class="w-150">
    <h1 class="text-xl font-bold mb-4">{$t('content.data.trainDialog.title')}</h1>
    <p>{$t('content.data.trainDialog.text')}</p>
    <div class="flex justify-end">
      <!-- TODO: translation for "Back" button -->
      <StandardButton onClick={closeTrainingDialog}>Back</StandardButton>
      <StandardButton onClick={startTraining}>{$t('content.data.trainDialog.title')}</StandardButton>
    </div>
  </div>
</StandardDialog>

<StandardDialog isOpen={$state.isTraining} onClose={closeTrainingDialog}>
  <div class="w-150">
    <p>{$t('menu.trainer.isTrainingModelButton')}}</p>
    <div class="ml-auto mr-auto flex center-items justify-center">
      <i
        class="fa fa-solid fa-circle-notch text-5xl animate-spin animate-duration-[2s]" />
    </div>
  </div>
</StandardDialog>

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

  const trainingButtonDisabled = !sufficientData || !$state.isInputConnected || $state.isTraining;
  let trainingDialogOpen = false;

  const closeTrainingDialog = () => {
    trainingDialogOpen = false;
  };

  const startTraining = () => {
    closeTrainingDialog();
    trainModel();
  }
</script>

<StandardButton onClick={() => {trainingDialogOpen = true}} disabled={trainingButtonDisabled}>{$t(trainButtonLabel)}</StandardButton>

<StandardDialog isOpen={trainingDialogOpen && !$state.isTraining} onClose={closeTrainingDialog}>
  <div class="w-150">
    <h1 class="text-xl font-bold mb-4">Train the model</h1>
    <p>Do you want to train the model with the data you have added so you can test it?</p>
    <div class="flex justify-end">
      <StandardButton onClick={closeTrainingDialog}>Back</StandardButton>
      <StandardButton onClick={startTraining}>Train the model</StandardButton>
    </div>
  </div>
</StandardDialog>

<StandardDialog isOpen={$state.isTraining} onClose={closeTrainingDialog}>
  <div class="w-150">
    <p>Training the model</p>
    <div class="ml-auto mr-auto flex center-items justify-center">
      <i class="fa fa-solid fa-circle-notch text-5xl animate-spin animate-duration-[2s]" />
    </div>
  </div>
</StandardDialog>

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
-->

<script lang="ts">
  import { hasSufficientData, state } from '../../script/stores/uiStore';
  import StandardButton from '../../components/StandardButton.svelte';
  import { trainModel } from '../../script/ml';
  import { t } from '../../i18n';
  import { Paths, navigate } from '../../router/paths';
  import { gestures } from '../../script/stores/mlStore';

  export let type: 'navigate' | 'train' = 'train';

  $: trainButtonLabel = !$state.isPredicting
    ? 'menu.trainer.trainModelButton'
    : 'menu.trainer.trainNewModelButton';

  $: sufficientData = hasSufficientData($gestures);

  $: trainingButtonDisabled = !sufficientData || $state.isTraining;

  let trainingDialogOpen = false;

  const closeTrainingDialog = () => {
    trainingDialogOpen = false;
  };

  const startTraining = () => {
    closeTrainingDialog();
    trainModel();
  };

  const navitgateToTrainingPage = () => {
    navigate(Paths.TRAINING);
  };
</script>

<StandardButton
  onClick={type === 'navigate' ? navitgateToTrainingPage : startTraining}
  disabled={trainingButtonDisabled}
  type="primary"
  >{$t(trainButtonLabel)}
</StandardButton>

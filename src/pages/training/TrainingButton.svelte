<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { hasSufficientData, state } from '../../script/stores/uiStore';
  import StandardButton from '../../components/StandardButton.svelte';
  import { trainModel } from '../../script/ml';
  import { t } from '../../i18n';
  import { classifier } from '../../script/stores/Stores';
  import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
  import StaticConfiguration from '../../StaticConfiguration';

  const sufficientData = hasSufficientData();
  $: trainButtonLabel = !$state.isPredicting
    ? 'menu.trainer.trainModelButton'
    : 'menu.trainer.trainNewModelButton';

  const onClick = () => {
    trainModel(); // Old model training procedure
    classifier
      .getModel()
      .train(new LayersModelTrainer(StaticConfiguration.layersModelTrainingSettings)); // New procedure
  };
</script>

{#if sufficientData && !$state.isTraining}
  <StandardButton {onClick}>{$t(trainButtonLabel)}</StandardButton>
{/if}

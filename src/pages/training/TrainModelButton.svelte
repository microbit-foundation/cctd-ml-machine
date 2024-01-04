<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { state } from '../../script/stores/uiStore';
  import StandardButton from '../../components/StandardButton.svelte';
  import { t } from '../../i18n';
  import { classifier } from '../../script/stores/Stores';
  import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';
  import StaticConfiguration from '../../StaticConfiguration';

  const model = classifier.getModel();

  $: trainButtonLabel = !$model.hasModel
    ? 'menu.trainer.trainModelButton'
    : 'menu.trainer.trainNewModelButton';

  const onClick = () => {
    model.train(new LayersModelTrainer(StaticConfiguration.layersModelTrainingSettings));
  };
</script>

<StandardButton {onClick}>{$t(trainButtonLabel)}</StandardButton>

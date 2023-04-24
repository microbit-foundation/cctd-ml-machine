<script lang="ts">
  import { hasSufficientData, state } from '../../script/stores/uiStore';
  import StandardButton from '../../components/StandardButton.svelte';
  import { trainModel } from '../../script/ml';
  import { t } from '../../i18n';

  const sufficientData = hasSufficientData();
  $: trainButtonLabel = !$state.isPredicting
    ? 'menu.trainer.trainModelButton'
    : 'menu.trainer.trainNewModelButton';
</script>

{#if sufficientData && $state.isInputConnected && !$state.isTraining}
  <StandardButton onClick="{trainModel}">{$t(trainButtonLabel)}</StandardButton>
{/if}

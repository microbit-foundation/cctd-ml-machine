<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import ControlBar from '../../../components/ui/control-bar/ControlBar.svelte';
  import ModelRegistry from '../../../lib/domain/ModelRegistry';
  import { Feature, hasFeature } from '../../../lib/FeatureToggles';
  import { t } from '../../../i18n';
  import { stores } from '../../../lib/stores/Stores';
  import { navigate, Paths } from '../../../router/Router';
  import StandardButton from '../../../components/ui/buttons/StandardButton.svelte';

  const selectedModel = stores.getSelectedModel();

  const showTabBar = hasFeature(Feature.KNN_MODEL);
  if (!showTabBar) {
    $selectedModel = ModelRegistry.NeuralNetwork;
  }

  $: isSelected = (id: string) => {
    return $selectedModel.id === id;
  };
</script>

{#if showTabBar}
  <ControlBar expanded shadows={false}>
    <div class="flex justify-end flex-row flex-grow h-full px-2">
      <div class="flex flex-row gap-2 justify-center py-2">
        {#each ModelRegistry.getModels() as model}
          <StandardButton small outlined={!isSelected(model.id)} onClick={() => selectedModel.set(model)}>
            {model.title}
          </StandardButton>
        {/each}
      </div>
    </div>
  </ControlBar>
{:else}
  <ControlBar>
    <div class="min-h-12" />
    <StandardButton
      fillOnHover
      small
      outlined
      bold={false}
      shadows={false}
      color={'primary'}
      onClick={() => {
        navigate(Paths.FILTERS);
      }}>
      {$t('content.trainer.controlbar.filters')}
    </StandardButton>
  </ControlBar>
{/if}

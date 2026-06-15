<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import ControlBar from '../../../components/ui/control-bar/ControlBar.svelte';
  import { Feature, hasFeature } from '../../../lib/FeatureToggles';
  import { t } from '../../../i18n';
  import { navigate, Paths } from '../../../router/Router';
  import StandardButton from '../../../components/ui/buttons/StandardButton.svelte';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import ModelRegistry from '../../../core/model/ModelRegistry';
  import type { ModelType } from '../../../core/model/ModelType';

  const selectedModel = getControllers().getClassifierController().getSelectedModel();
  const classifierController = getControllers()
      .getClassifierController()

  const showTabBar = hasFeature(Feature.KNN_MODEL);
  if (!showTabBar) {
    classifierController
      .setSelectedModel(ModelRegistry.NeuralNetwork);
  }

  $: isSelected = (modelType: ModelType) => {
    return $selectedModel.getType() === modelType;
  };
</script>

{#if showTabBar}
  <ControlBar expanded shadows={false}>
    <div class="flex justify-end flex-row flex-grow h-full px-2">
      <div class="flex flex-row gap-2 justify-center py-2">
        {#each ModelRegistry.getModelsInfo() as model}
          <StandardButton
            small
            outlined={!isSelected(model.getType())}
            onClick={() => classifierController.setSelectedModel(model)}>
            {model.getLabel()}
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

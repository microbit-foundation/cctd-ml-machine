<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
  import { navigate, Paths } from '../../router/paths';
  import ModelRegistry from '../../script/domain/ModelRegistry';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import { t } from '../../i18n';
  import { stores } from '../../script/stores/Stores';
  import StandardDropdownButton from '../../components/buttons/StandardDropdownButton.svelte';

  const selectedModel = stores.getSelectedModel();

  const showTabBar = hasFeature(Feature.KNN_MODEL);
  if (!showTabBar) {
    $selectedModel = ModelRegistry.NeuralNetwork;
  }

  const onSelectNeuralNetwork = () => {
    $selectedModel = ModelRegistry.NeuralNetwork;
  };
  const onSelectKnn = () => {
    $selectedModel = ModelRegistry.KNN;
  };
  $: isSelected = (id: string) => {
    return $selectedModel.id === id;
  };
</script>

{#if showTabBar}
  <ControlBar expanded shadows={false}>
    <div class="flex justify-between flex-row flex-grow h-full px-2">
      <div>
        <p>Hello</p>
      </div>
      <div class="flex flex-row gap-2 justify-center">
        <div class="flex flex-col justify-center">
          <StandardDropdownButton
            fillOnHover
            outlined={!isSelected(ModelRegistry.NeuralNetwork.id)}
            small>
            <p>Neural Network</p>
            <div slot="content">
              <p>Hello world</p>
            </div>
          </StandardDropdownButton>
        </div>
        <div class="flex flex-col justify-center">
          <StandardDropdownButton
            fillOnHover
            outlined={!isSelected(ModelRegistry.KNN.id)}
            small>
            <p>KNN Model</p>
            <div slot="content">
              <p>Hello world</p>
            </div>
          </StandardDropdownButton>
        </div>
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

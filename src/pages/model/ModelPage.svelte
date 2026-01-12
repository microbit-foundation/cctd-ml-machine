<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from 'svelte-i18n';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import ControlBar from '../../components/ui/control-bar/ControlBar.svelte';
  import ExpandableControlBarMenu from '../../components/ui/control-bar/control-bar-items/ExpandableControlBarMenu.svelte';
  import ModelPageStackView from './stackview/ModelPageStackView.svelte';
  import ModelPageTileView from './tileview/ModelPageTileView.svelte';
  import { navigate, Paths } from '../../router/Router';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import { OutputTarget } from '../../backend/domain/implementation/output/OutputTarget';
  import { Feature } from '../../backend/application/feature/Feature';

  const controllers = getControllers();
  const outputController = controllers.getOutputController();
  const featureController = controllers.getFeatureController();
  const outputTarget = outputController.getOutputTarget();

  const openMakecode = () => {
    navigate(Paths.MAKECODE);
    outputController.setOutputTargetMakecode();
  };
</script>

<div>
  <ControlBar>
    {#if featureController.hasFeature(Feature.MAKECODE)}
      <ExpandableControlBarMenu>
        <StandardButton small outlined onClick={openMakecode}>
          {$t('content.model.output.toMakeCode')}
        </StandardButton>
      </ExpandableControlBarMenu>
    {/if}
  </ControlBar>
</div>

<div class="h-[calc(100%-48px)] flex flex-col">
  {#if $outputTarget == OutputTarget.MAKECODE}
    <ModelPageTileView />
  {:else}
    <ModelPageStackView />
  {/if}
</div>

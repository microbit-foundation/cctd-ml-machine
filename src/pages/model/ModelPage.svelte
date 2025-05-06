<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StaticConfiguration from '../../StaticConfiguration';
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import ControlBar from '../../components/ui/control-bar/ControlBar.svelte';
  import ExpandableControlBarMenu from '../../components/ui/control-bar/control-bar-items/ExpandableControlBarMenu.svelte';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import { ModelView, state } from '../../lib/stores/Stores';
  import ModelPageStackView from './stackview/ModelPageStackView.svelte';
  import ModelPageTileView from './tileview/ModelPageTileView.svelte';

  const openMakeCodeInNewTab = () => {
    window.open(StaticConfiguration.makecodeFirmwareUrl, '_blank');
  };
</script>

<div>
  <ControlBar>
    {#if hasFeature(Feature.MAKECODE)}
      <ExpandableControlBarMenu>
        <StandardButton small outlined onClick={openMakeCodeInNewTab}>
          MakeCode HEX
        </StandardButton>
      </ExpandableControlBarMenu>
    {/if}
  </ControlBar>
</div>

<div class="pt-4 pl-3">
  {#if $state.modelView == ModelView.TILE}
    <ModelPageTileView />
  {:else}
    <ModelPageStackView />
  {/if}
</div>

<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from 'svelte-i18n';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import ControlBar from '../../components/ui/control-bar/ControlBar.svelte';
  import ExpandableControlBarMenu from '../../components/ui/control-bar/control-bar-items/ExpandableControlBarMenu.svelte';
  import { Feature, hasFeature } from '../../lib/FeatureToggles';
  import { modelView, ModelView } from '../../lib/stores/ApplicationState';
  import ModelPageStackView from './stackview/ModelPageStackView.svelte';
  import ModelPageTileView from './tileview/ModelPageTileView.svelte';
  import { navigate, Paths } from '../../router/Router';

  const openMakecode = () => {
    navigate(Paths.MAKECODE);
  };
</script>

<div>
  <ControlBar>
    {#if hasFeature(Feature.MAKECODE)}
      <ExpandableControlBarMenu>
        <StandardButton small outlined onClick={openMakecode}>
          {$t('content.model.output.toMakeCode')}
        </StandardButton>
      </ExpandableControlBarMenu>
    {/if}
  </ControlBar>
</div>

<div class="pt-4 pl-3">
  {#if $modelView == ModelView.TILE}
    <ModelPageTileView />
  {:else}
    <ModelPageStackView />
  {/if}
</div>

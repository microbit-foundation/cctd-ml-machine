<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/StandardButton.svelte';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
  import ExpandableControlBarMenu from '../../components/control-bar/control-bar-items/ExpandableControlBarMenu.svelte';
  import { ModelView, state } from '../../script/stores/uiStore';
  import ModelPageStackView from './ModelPageStackView.svelte';
  import ModelPageTileView from './ModelPageTileView.svelte';

  const openMakeCodeInNewTab = () => {
    window.open(
      'https://makecode.microbit.org/#pub:04730-01245-34848-93416',
      '_blank', // <- This is what makes it open in a new window.
    );
  };
</script>

<div>
  <ControlBar>
    <ExpandableControlBarMenu>
      <StandardButton small outlined onClick={openMakeCodeInNewTab}>
        MakeCode HEX
      </StandardButton>
    </ExpandableControlBarMenu>
  </ControlBar>
</div>
<div class="pt-4 pl-3">
  {#if $state.modelView == ModelView.TILE}
    <ModelPageTileView />
  {:else}
    <ModelPageStackView />
  {/if}
</div>

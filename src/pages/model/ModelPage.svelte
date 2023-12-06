<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { ModelView, state } from '../../script/stores/uiStore';
  import TabView from '../../views/TabView.svelte';
  import ModelPageStackView from './ModelPageStackView.svelte';
  import ModelPageTileView from './ModelPageTileView.svelte';
</script>

<div>
  <TabView />

  {#if $state.modelView == ModelView.TILE}
    <ModelPageTileView />
  {:else}
    <ModelPageStackView enableOutputGestures={false}/>
  {/if}
</div>

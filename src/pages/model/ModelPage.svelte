<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
  import { ModelView, state } from '../../script/stores/uiStore';
  import ModelPageStackView from './ModelPageStackView.svelte';
  import ModelPageTileView from './ModelPageTileView.svelte';

  const switchView = () => {
    $state.modelView =
      $state.modelView == ModelView.STACK ? ModelView.TILE : ModelView.STACK;
  };
</script>

<div>
  <ControlBar />
</div>
<div class="pt-4 pl-3">
  {#if $state.modelView == ModelView.TILE}
    <ModelPageTileView />
  {:else}
    <ModelPageStackView />
  {/if}
</div>
<div class="absolute bottom-0 right-0 p-1">
  <div class="border-1 bg-backgroundlight p-1">
    <button class="text-primary text-sm" on:click={switchView}>
      {#if $state.modelView == ModelView.STACK}
        Show makecode >>
      {/if}
      {#if $state.modelView == ModelView.TILE}
        Go back >>
      {/if}
    </button>
  </div>
</div>

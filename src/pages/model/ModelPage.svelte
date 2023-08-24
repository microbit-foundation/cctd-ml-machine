<script lang="ts">
  import CookieManager from '../../script/CookieManager';
  import { state } from '../../script/stores/uiStore';
  import ModelPageStackView from './ModelPageStackView.svelte';
  import ModelPageTileView from './ModelPageTileView.svelte';
</script>

{#if $state.isOutputMakecodeHex && CookieManager.hasFeatureFlag('mkcd')}
  <ModelPageTileView />
{:else}
  <ModelPageStackView />
{/if}

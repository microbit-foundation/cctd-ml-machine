<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<style global windi:preflights:global windi:safelist:global>
  @keyframes textAni {
    0% {
      opacity: 0;
    }
    3% {
      opacity: 1;
    }
    97% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { compatibility } from './lib/stores/uiStore';
  import LoadingSpinner from './components/ui/LoadingSpinner.svelte';
  import BluetoothIncompatibilityWarningDialog from './components/features/BluetoothIncompatibilityWarningDialog.svelte';
  import CookieManager from './lib/CookieManager';
  import Router from './router/Router.svelte';
  import { Feature, getFeature } from './lib/FeatureToggles';
  import { welcomeLog } from './lib/utils/Logger';
  import MediaQuery from './components/layout/MediaQuery.svelte';
  import BottomBarMenuView from './components/layout/BottomBarMenuView.svelte';
  import CookieBanner from './components/features/cookie-bannner/CookieBanner.svelte';
  import SnackbarView from './components/features/snackbar/SnackbarView.svelte';
  import IncompatiblePlatformView from './components/layout/IncompatiblePlatformView.svelte';
  import OverlayView from './components/layout/OverlayView.svelte';
  import SideBarMenuView from './components/layout/SideBarMenuView.svelte';
  import PageContentView from './components/layout/PageContentView.svelte';
  import { DeviceRequestStates, state } from './lib/stores/applicationState';
  welcomeLog();

  if (CookieManager.isReconnectFlagSet()) {
    $state.offerReconnect = true;
    $state.reconnectState = DeviceRequestStates.INPUT;
    CookieManager.unsetReconnectFlag();
  }

  document.title = getFeature(Feature.TITLE);
</script>

<Router>
  <SnackbarView />
  {#if !$compatibility.platformAllowed}
    <!-- Denies mobile users access to the platform -->
    <IncompatiblePlatformView />
  {:else}
    {#if $state.isLoading}
      <main class="h-screen w-screen bg-primary flex absolute z-10" transition:fade>
        <LoadingSpinner />
      </main>
    {/if}
    <!-- Here we use the hidden class, to allow for it to load in. -->
    <!-- <main class="h-screen w-screen m-0 relative flex" class:hidden={$state.isLoading}> -->
    <main class="h-screen w-screen m-0 relative flex">
      <!-- OVERLAY ITEMS -->
      <CookieBanner />
      <OverlayView />
      <BluetoothIncompatibilityWarningDialog />

      <!-- SIDE BAR -->
      <MediaQuery query="(max-width: 1500px)" let:matches={isSmall}>
        {#if isSmall}
          <div class="h-full flex min-w-65 max-w-65">
            <SideBarMenuView />
          </div>
        {:else}
          <div class="h-full flex min-w-75 max-w-75">
            <SideBarMenuView />
          </div>
        {/if}
      </MediaQuery>

      <div
        class="h-full w-full overflow-y-hidden overflow-x-auto
    flex flex-col bg-backgrounddark shadow-2xl">
        <!-- CONTENT -->
        <div class="relative z-1 flex-1 overflow-y-auto flex-row">
          <PageContentView />
        </div>

        <!-- BOTTOM BAR -->
        <div class="h-160px w-full">
          <BottomBarMenuView />
        </div>
      </div>
    </main>
  {/if}
</Router>

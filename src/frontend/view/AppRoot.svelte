<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { AppController } from '../../backend/interface-controller/abstract/AppController';
  import Router from '../router/Router.svelte';
  import SnackbarView from '../snackbar/SnackbarView.svelte';
  import { compatibility } from '../lib/stores/uiStore';
  import IncompatiblePlatformView from './layout/IncompatiblePlatformView.svelte';
  import { isLoading } from '../lib/stores/ApplicationState';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';
  import CookieBanner from '../cookie-bannner/CookieBanner.svelte';
  import OverlayView from './layout/OverlayView.svelte';
  import BluetoothIncompatibilityWarningDialog from '../incompatible-platform/BluetoothIncompatibilityWarningDialog.svelte';
  import MediaQuery from './layout/MediaQuery.svelte';
  import SideBarMenuView from './layout/SideBarMenuView.svelte';
  import PageContentView from './layout/PageContentView.svelte';
  import BottomBarMenuView from './layout/BottomBarMenuView.svelte';
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import { MicrobitRole } from '../../backend/domain/microbit/MicrobitRole';

  const controller: AppController = getControllers().getAppController();
  const microbitController = getControllers().getMicrobitController();

  if (controller.isReconnectFlagSet()) {
    microbitController.offerReconnect(MicrobitRole.INPUT);
  }
</script>

<Router>
  <SnackbarView />
  {#if !$compatibility.platformAllowed}
    <!-- Denies mobile users access to the platform -->
    <IncompatiblePlatformView />
  {:else}
    {#if $isLoading}
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

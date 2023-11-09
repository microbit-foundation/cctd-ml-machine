<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import ConnectionBehaviours from './script/connection-behaviours/ConnectionBehaviours';
  import InputBehaviour from './script/connection-behaviours/InputBehaviour';
  import OutputBehaviour from './script/connection-behaviours/OutputBehaviour';
  import OverlayView from './views/OverlayView.svelte';
  import TabView from './views/TabView.svelte';
  import PageContentView from './views/PageContentView.svelte';
  import BottomBarMenuView from './views/BottomBarMenuView.svelte';
  import CookieBanner from './components/cookie-bannner/CookieBanner.svelte';
  import { fade } from 'svelte/transition';
  import { state } from './script/stores/uiStore';
  import LoadingSpinner from './components/LoadingSpinner.svelte';
  import { checkCompatibility } from './script/compatibility/CompatibilityChecker';
  import IncompatiblePlatformView from './views/IncompatiblePlatformView.svelte';
  import BluetoothIncompatibilityWarningDialog from './components/BluetoothIncompatibilityWarningDialog.svelte';
  import CookieManager from './script/CookieManager';
  import { DeviceRequestStates } from './script/stores/connectDialogStore';
  import Environment from './script/Environment';
  import Router from './router/Router.svelte';
  import VideoDialog from './components/VideoDialog.svelte';
  import ControlBar from './components/control-bar/ControlBar.svelte';
  import SelectLanguageControlBarDropdown from './components/control-bar/control-bar-items/SelectLanguageControlBarDropdown.svelte';

  ConnectionBehaviours.setInputBehaviour(new InputBehaviour());
  ConnectionBehaviours.setOutputBehaviour(new OutputBehaviour());

  if (CookieManager.isReconnectFlagSet()) {
    $state.offerReconnect = true;
    $state.reconnectState = DeviceRequestStates.INPUT;
    CookieManager.unsetReconnectFlag();
  }

  document.title = Environment.pageTitle;

  const introVideoUrl =
    'https://datatraener0dr0media-euno.streaming.media.azure.net/18233c69-2bc3-4b1b-9e2d-249e37b56307/Ultrabit_01_Introvideo_Datatræneren.mp4';
</script>

<Router>
  {#if !checkCompatibility().platformAllowed}
    <!-- Denies mobile users access to the platform -->
    <IncompatiblePlatformView />
  {:else}
    {#if $state.isLoading}
      <main class="h-screen w-screen bg-primary flex absolute z-10" transition:fade>
        <LoadingSpinner />
      </main>
    {/if}

    <main class="h-screen w-screen m-0 relative flex">
      <CookieBanner />
      <OverlayView />
      <BluetoothIncompatibilityWarningDialog />
      <VideoDialog videoURL={introVideoUrl} />

      <div
        class="h-full w-full overflow-y-hidden overflow-x-auto flex flex-col bg-backgrounddark">
        <ControlBar>
          <img
            class="mr-8"
            src="/imgs/microbit-logo.svg"
            alt="Micro:bit logo"
            width="150px" />
          <h1 class="text-xl font-thin whitespace-nowrap">machine learning tool</h1>
          <div class="flex flex-row basis-full justify-end">
            <SelectLanguageControlBarDropdown />
          </div>
        </ControlBar>

        <TabView />

        <div class="relative z-1 flex-1 overflow-y-auto flex-row">
          <PageContentView />
        </div>

        <div class="h-160px w-full">
          <BottomBarMenuView />
        </div>
      </div>
    </main>
  {/if}
</Router>

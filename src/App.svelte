<style global windi:preflights:global windi:safelist:global>
  .textAnimation {
    animation: 3s textAni ease;
  }

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
  import ConnectionBehaviours from './script/connection-behaviours/ConnectionBehaviours';
  import InputBehaviour from './script/connection-behaviours/InputBehaviour';
  import OutputBehaviour from './script/connection-behaviours/OutputBehaviour';
  import OverlayView from './views/OverlayView.svelte';
  import SideBarMenuView from './views/SideBarMenuView.svelte';
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
  import MicrobitBluetooth from './script/microbit-interfacing/MicrobitBluetooth';
  import Microbits from './script/microbit-interfacing/Microbits';
  import MBSpecs from './script/microbit-interfacing/MBSpecs';

  ConnectionBehaviours.setInputBehaviour(new InputBehaviour());
  ConnectionBehaviours.setOutputBehaviour(new OutputBehaviour());

  if (CookieManager.isReconnectFlagSet()) {
    $state.offerReconnect = true;
    $state.reconnectState = DeviceRequestStates.INPUT;
    CookieManager.unsetReconnectFlag();
  }

  document.title = Environment.pageTitle;
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
    <!-- Here we use the hidden class, to allow for it to load in. -->
    <!-- <main class="h-screen w-screen m-0 relative flex" class:hidden={$state.isLoading}> -->
    <main class="h-screen w-screen m-0 relative flex">
      <!-- OVERLAY ITEMS -->
      <CookieBanner />
      <OverlayView />
      <BluetoothIncompatibilityWarningDialog />

      <!-- SIDE BAR -->
      <div class="h-full flex min-w-75 max-w-75">
        <SideBarMenuView />
      </div>

      <div
        class="h-full w-full overflow-y-hidden overflow-x-auto
    flex flex-col bg-backgrounddark shadow-2xl">
        <!-- CONTENT -->
        <button
          on:click={() => {
            MicrobitBluetooth.requestDevice('vivaz', () => {
              console.log('FAILED');
            }).then(device => {
              MicrobitBluetooth.createMicrobitBluetooth(
                device,
                mbbt => {
                  mbbt.getUARTService().then(uartService => {
                    uartService.getCharacteristic(MBSpecs.Characteristics.UART_DATA_TX).then(txChar => {
                      txChar.startNotifications();
                        txChar.addEventListener("characteristicvaluechanged", (val) => {
                          console.log(val);
                        })
                      })
                    uartService
                      .getCharacteristic(MBSpecs.Characteristics.UART_DATA_RX)
                      .then(rxChar => {
                        const value = 's_connected';
                        const view = new DataView(new ArrayBuffer(1 + value.length));

                        for (let i = 0; i < value.length; i++) {
                          view.setUint8(i, value.charCodeAt(i));
                        }
                        view.setUint8(value.length, '#'.charCodeAt(0));
                        setTimeout(() => {
                          rxChar.writeValue(view)
                        }, 2000);
                      });
                      
                  });
                },
                () => {},
                () => {},
                () => {},
                () => {},
              );
            });
          }}>Hello</button>
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

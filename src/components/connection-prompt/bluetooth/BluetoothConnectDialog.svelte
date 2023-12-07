<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import MBSpecs from '../../../script/microbit-interfacing/MBSpecs';
  import PatternMatrix from '../../PatternMatrix.svelte';
  import { t } from '../../../i18n';
  import { onDestroy, onMount } from 'svelte';
  import StandardButton from '../../StandardButton.svelte';
  import { state } from '../../../script/stores/uiStore';
  import {
    btPatternInput,
    btPatternOutput,
    isInputPatternValid,
  } from '../../../script/stores/connectionStore';
  import { writable } from 'svelte/store';
  import type { Writable } from 'svelte/store';
  import Microbits from '../../../script/microbit-interfacing/Microbits';
  import { DeviceRequestStates } from '../../../script/stores/connectDialogStore';
  import Environment from '../../../script/Environment';
  import StaticConfiguration from '../../../StaticConfiguration';

  // callbacks
  export let deviceState: DeviceRequestStates;
  export let onBluetoothConnected: () => void;

  let isConnecting = false;

  let attemptedToPairWithInvalidPattern = false;

  let patternMatrixState: Writable<boolean[]> =
    deviceState === DeviceRequestStates.INPUT ? btPatternInput : btPatternOutput;

  let timeoutProgress = writable<number>(0);

  let timeouted = writable<boolean>(false);

  const connectButtonClicked = () => {
    if (!isInputPatternValid()) {
      attemptedToPairWithInvalidPattern = true;
      return;
    }
    timeoutProgress.set(0);
    if (isConnecting) {
      // Safeguard to prevent trying to connect multiple times at once
      return;
    }
    isConnecting = true;
    let name = MBSpecs.Utility.patternToName($patternMatrixState);
    const connectionResult = () => {
      if (deviceState == DeviceRequestStates.INPUT) {
        return Microbits.assignInput(name);
      } else {
        return Microbits.assignOutput(name);
      }
    };

    const connectTimeout = setTimeout(() => {
      Environment.isInDevelopment && console.log('Connection timed out');
      timeouted.set(true);
    }, StaticConfiguration.connectTimeoutDuration);

    void connectionResult()
      .then(didSucceed => {
        clearTimeout(connectTimeout);
        timeouted.set(false);
        Environment.isInDevelopment && console.log('Connection result ', didSucceed);
        if (didSucceed) {
          onBluetoothConnected();
        } else {
          isConnecting = false;
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  function connectOnEnterClick(event: KeyboardEvent): void {
    if (event.code !== 'Enter') {
      return;
    }
    void connectButtonClicked();
  }

  function updateMatrix(matrix: boolean[]): void {
    $patternMatrixState = matrix;
    attemptedToPairWithInvalidPattern = false;
  }

  onMount(() => {
    document.addEventListener('keypress', connectOnEnterClick);
  });
  onDestroy(() => {
    document.removeEventListener('keypress', connectOnEnterClick);
  });

  onMount(() => {
    // Resets the bluetooth connection prompt for cancelled device requests
    $state.requestDeviceWasCancelled = false;
  });
</script>

<main>
  <h1 class="mb-5 font-bold">
    {$t('popup.connectMB.bluetooth.heading')}
  </h1>

  {#if $state.requestDeviceWasCancelled && !isConnecting}
    <p class="text-warning mb-1">{$t('popup.connectMB.bluetooth.cancelledConnection')}</p>
  {/if}
  {#if attemptedToPairWithInvalidPattern}
    <p class="text-warning mb-1">{$t('popup.connectMB.bluetooth.invalidPattern')}</p>
  {/if}
  {#if isConnecting}
    <!-- Show spinner while connecting -->
    <div class="w-650px flex flex-col justify-center items-center">
      <p>{$t('popup.connectMB.bluetooth.connecting')}</p>
      <img alt="loading" src="/imgs/loadingspinner.gif" width="100px" />
    </div>
    {#if $timeouted}
      <div>
        <p class="text-red-500">{$t('popup.connectMB.bluetooth.timeouted')}</p>
      </div>
    {/if}
  {:else}
    <div class="grid grid-cols-3 mb-5 w-650px">
      <div class="col-span-2 pt-5">
        <p>1. {$t('popup.connectMB.bluetooth.step0')}</p>
        <p>2. {$t('popup.connectMB.bluetooth.step1')}</p>
        <p>3. {$t('popup.connectMB.bluetooth.step2')}</p>
        <p>4. {$t('popup.connectMB.bluetooth.step3')}</p>
      </div>
      <div>
        <PatternMatrix matrix={$patternMatrixState} onMatrixChange={updateMatrix} />
      </div>
    </div>
    <StandardButton onClick={connectButtonClicked}
      >{$t('popup.connectMB.bluetooth.connect')}</StandardButton>
  {/if}
  <!-- </div> -->
</main>

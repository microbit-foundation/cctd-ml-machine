<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import PatternMatrix from '../../PatternMatrix.svelte';
  import { t } from '../../../i18n';
  import { DeviceRequestStates } from '../../../script/stores/connectDialogStore';
  import {
    btPatternInput,
    btPatternOutput,
    isInputPatternValid,
  } from '../../../script/stores/connectionStore';
  import type { Writable } from 'svelte/store';
  import StandardButton from '../../StandardButton.svelte';

  // callbacks
  export let deviceState: DeviceRequestStates;
  export let connectButtonClicked: () => void;

  let patternMatrixState: Writable<boolean[]> =
    deviceState === DeviceRequestStates.INPUT ? btPatternInput : btPatternOutput;
  let attemptedToPairWithInvalidPattern = false;

  function updateMatrix(matrix: boolean[]): void {
    $patternMatrixState = matrix;
    attemptedToPairWithInvalidPattern = false;
  }
</script>

<main>
  <h1 class="mb-5 font-bold">
    {$t('popup.connectMB.bluetooth.heading')}
  </h1>
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
</main>
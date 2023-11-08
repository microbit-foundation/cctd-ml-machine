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

<main class="w-180">
  <h1 class="mb-5 font-bold text-2xl justify-center">
    {$t('popup.connectMB.pattern.heading')}
  </h1>
  <p>{$t('popup.connectMB.pattern.subtitle')}</p>
    <div class="flex justify-center pt-20 pb-10">
      <PatternMatrix matrix={$patternMatrixState} onMatrixChange={updateMatrix} />
    </div>
  <div class="justify-end flex pt-10">
    <StandardButton onClick={connectButtonClicked}>{$t('popup.connectMB.bluetooth.connect')}</StandardButton>
  </div>
</main>
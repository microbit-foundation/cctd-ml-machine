<script lang="ts">
  import { t } from '../../../i18n.js';
  import StandardButton from '../../StandardButton.svelte';
  import { state } from '../../../script/stores/uiStore.js';
  import {
    ConnectDialogStates,
    connectionDialogState,
  } from '../../../script/stores/connectDialogStore.js';
</script>

<main>
  <div class="w-600px text-left">
    <h1 class="font-bold mb-5 text-center">
      {$t('connectMB.usb.header')}
    </h1>
    <p class="mb-3 mt-2 text-warning font-bold">
      {$t('connectMB.usb.firmwareBroken.warning')}
    </p>
    <p>
      {$t('connectMB.usb.firmwareBroken.content1')}
    </p>
    <p class="mt-2">
      {$t('connectMB.usb.firmwareBroken.content2')}
    </p>

    <p class="mb-2">
      {$t('connectMB.usb.firmwareBroken.content3')}
      <a
        class="text-link underline"
        href="https://microbit.org/get-started/user-guide/firmware/"
        >{$t('connectMB.usb.firmwareBroken.content3.website')}</a>
    </p>
    <StandardButton
      onClick={() => {
        $state.brokenFirmwareDetected = false;
        $connectionDialogState.connectionState = ConnectDialogStates.MANUAL_TUTORIAL;
      }}>{$t('connectMB.usb.firmwareBroken.button.skip')}</StandardButton>
  </div>
</main>

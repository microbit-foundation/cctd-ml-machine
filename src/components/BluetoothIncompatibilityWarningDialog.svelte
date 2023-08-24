<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { WebBluetoothCompatibility } from '../script/compatibility/CompatibilityList';
  import { t } from '../i18n';
  import StandardDialog from './dialogs/StandardDialog.svelte';
  import { isBluetoothWarningDialogOpen } from '../script/stores/uiStore';
</script>

<StandardDialog
  isOpen={$isBluetoothWarningDialogOpen}
  onClose={() => {
    $isBluetoothWarningDialogOpen = false;
  }}>
  <div>
    <h1 class="font-bold text-red-500 text-xl min-w-140">
      {$t('popup.compatibility.bluetooth.header')}
    </h1>
    <hr />
    <div class="pt-3">
      <p>{$t('popup.compatibility.bluetooth.explain')}</p>
      <div class="h-2" />
      <p>{$t('popup.compatibility.bluetooth.advice')}</p>
    </div>
    <div class="h-4" />
    <hr />
    <div class="h-4" />
    <div class="pl-2 pt-2 w-full">
      <table class="m-auto">
        <thead>
          <tr class="font-bold">
            <td>Browser</td>
            <td class="text-right">Version</td>
          </tr>
        </thead>
        <tbody>
          {#each WebBluetoothCompatibility.getSupportedBrowsers() as browser}
            <tr class="border-solid border-b-1">
              <td>{browser.browser}</td>
              <td class="text-right">v{String(browser.version)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</StandardDialog>

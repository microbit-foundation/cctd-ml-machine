<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import NewGestureButton from './NewGestureButton.svelte';
  import PleaseConnect from '../PleaseConnect.svelte';
  import StandardButton from '../components/buttons/StandardButton.svelte';
  import { t } from '../../i18n';
  import { importExampleDataset } from './DataPage';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
</script>

<div class="flex flex-col flex-grow justify-between">
  <div>
    {#if !$microbitConnection.getInput().isConnected()}
      <div class="mt-4">
        <PleaseConnect />
      </div>
    {/if}
    {#if $microbitConnection.getInput().isConnected()}
      <div class="flex justify-center">
        <div class="text-center text-xl w-1/2 text-bold text-primarytext">
          <p>{$t('content.data.noData')}</p>
        </div>
      </div>
      <NewGestureButton />
    {/if}
  </div>
  <div>
    <div class="flex mt-3 mb-3 justify-center">
      <StandardButton onClick={importExampleDataset}>
        {$t('content.data.noData.templateDataButton')}
      </StandardButton>
    </div>
  </div>
</div>

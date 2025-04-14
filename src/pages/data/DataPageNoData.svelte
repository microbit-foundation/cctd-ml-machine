<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/buttons/StandardButton.svelte';
  import NewGestureButton from '../../components/NewGestureButton.svelte';
  import PleaseConnect from '../../components/PleaseConnect.svelte';
  import { t } from '../../i18n';
  import { state } from '../../script/stores/Stores';
  import { importExampleDataset } from './DataPage';
</script>

<div class="flex flex-col flex-grow justify-between">
  <div>
    {#if !$state.isInputConnected}
      <div class="mt-4">
        <PleaseConnect />
      </div>
    {/if}
    {#if $state.isInputConnected}
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

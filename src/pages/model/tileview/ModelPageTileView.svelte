<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import TrainModelFirstTitle from '../../../components/features/model/TrainModelFirstTitle.svelte';
  import { onMount } from 'svelte';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import ModelPageTileViewTiles from './ModelPageTileViewTiles.svelte';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import MakeCodeProjectBlocks from '../../../components/features/makecode/MakeCodeProjectBlocks.svelte';
  import { navigate, Paths } from '../../../router/Router';
  import { t } from 'svelte-i18n';

  const classifierController = getControllers().getClassifierController();
  const classifier = classifierController.getClassifier();

  const makecodeController = getControllers().getMakeCodeController();
  const outputController = getControllers().getOutputController();

   onMount(() => {
    Microbits.resetIOPins();
  });

  const openMakeCode = () => {
    navigate(Paths.MAKECODE);
    outputController.setOutputTargetMakecode();
  };
</script>

<main class="px-4 pt-4 flex flex-grow">
  <div class="flex-col flex-grow">
    {#if !$classifier}
      <TrainModelFirstTitle />
    {:else}
      <ModelPageTileViewTiles />
      {#if !makecodeController.hasProjectBeenChanged()}
        <div
          class="flex flex-row mt-12 mx-30 bg-backgroundlight border-secondary border-1 p-4 rounded justify-center shadow-xl">
          <div class="flex flex-col">
            <p class="text-md font-bold text-primary text-center">
              {$t('content.model.makecode.heading')}
            </p>
            <p class="text-sm">
              {$t('content.model.makecode.description')}
              <span on:click={openMakeCode} class="text-secondary cursor-pointer">
                {$t('content.model.makecode.heading')}
              </span>
            </p>
          </div>
        </div>
      {:else}
        <div class="mt-2 bg-backgroundlight rounded-md p-1 shadow-sm text-xs">
          <div class="pb-2">
            <span class="underline cursor-pointer text-sm" on:click={openMakeCode}
              >{$t('content.model.makecode.edit')}</span>
          </div>
          <MakeCodeProjectBlocks />
        </div>
      {/if}
    {/if}
  </div>
</main>

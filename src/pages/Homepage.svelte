<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<style>
  .grid-container {
    display: grid;
    gap: 1rem 1rem;
    grid-template-areas:
      'a b'
      'a c';
  }
</style>

<script lang="ts">
  import { ComponentType } from 'svelte';
  import FrontPageContentTile from '../components/FrontPageContentTile.svelte';
  import DoItYourselfMachineLearningTile from './home-page-content-tiles/DoItYourselfMachineLearningTile.svelte';
  import NewFeaturesTile from './home-page-content-tiles/NewFeaturesTile.svelte';
  import WhatIsMachineLearningTile from './home-page-content-tiles/WhatIsMachineLearningTile.svelte';
  import ControlBar from '../components/control-bar/ControlBar.svelte';
  import ContactUsControlBarButton from '../components/control-bar/control-bar-items/ContactUsControlBarButton.svelte';
  import SelectLanguageControlBarDropdown from '../components/control-bar/control-bar-items/SelectLanguageControlBarDropdown.svelte';
  import { t } from '../i18n';
  import { state } from '../script/stores/uiStore';

  type ContentTile = { tile: ComponentType; spanColumns: number };
  // Just add the content titles you wish to put on front page, in the order you wish them to be there
  const contentTiles: ContentTile[] = [
    { tile: DoItYourselfMachineLearningTile, spanColumns: 1 },
    { tile: NewFeaturesTile, spanColumns: 1 },
    { tile: WhatIsMachineLearningTile, spanColumns: 2 },
  ];
</script>

<main class="h-full flex flex-col">
  <div class:hidden={$state.isLoading}>
    <div>
      <ControlBar>
        <div class="w-full">
          <div class="float-right flex flex-row">
            <ContactUsControlBarButton />
            <SelectLanguageControlBarDropdown />
          </div>
        </div>
      </ControlBar>
    </div>
    <div class="p-10 pb-2 pt-2 mt-3">
      <div class="grid-container grid-cols-2 min-w-800px">
        {#each contentTiles as { tile, spanColumns }}
          <FrontPageContentTile contentComponent={tile} fillColumns={spanColumns} />
        {/each}
      </div>
    </div>
    <div class="flex-grow flex items-end">
      <div class="pb-2 pl-10">
        <p>
          {$t('content.index.acknowledgement')} -
          <a class="text-link hover:underline" href="https://cctd.au.dk/">cctd.au.dk</a>
        </p>
      </div>
    </div>
  </div>
</main>

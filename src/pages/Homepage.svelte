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
  import FrontPageContentTile from '../components/FrontPageContentTile.svelte';
  import DoItYourselfMachineLearningTile from './home-page-content-tiles/DoItYourselfMachineLearningTile.svelte';
  import IntroVideoTile from './home-page-content-tiles/IntroVideoTile.svelte';
  import ControlBar from '../components/control-bar/ControlBar.svelte';
  import ContactUsControlBarButton from '../components/control-bar/control-bar-items/ContactUsControlBarButton.svelte';
  import SelectLanguageControlBarDropdown from '../components/control-bar/control-bar-items/SelectLanguageControlBarDropdown.svelte';
  import { t } from '../i18n';
  import { state } from '../script/stores/uiStore';
  import { fade } from 'svelte/transition';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';

  // Just add the content titles you wish to put on front page, in the order you wish them to be there
  const contentTiles = [DoItYourselfMachineLearningTile, IntroVideoTile];
</script>

<main class="h-full flex flex-col">
  {#if $state.isLoading}
    <div class="h-full w-full bg-primary flex absolute z-10" transition:fade>
      <LoadingSpinner />
    </div>
  {/if}
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
        {#each contentTiles as contentTile}
          <FrontPageContentTile contentComponent={contentTile} />
        {/each}
      </div>
    </div>
    <div class="flex-grow flex items-end">
      <div class="pb-2 pl-10">
        <p>{$t('content.index.acknowledgement')}</p>
      </div>
    </div>
  </div>
</main>

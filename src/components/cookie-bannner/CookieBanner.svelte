<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fly } from 'svelte/transition';
  import CookieManager from '../../script/CookieManager';
  import { t, locale, locales } from '../../i18n';
  import StandardDialog from '../dialogs/StandardDialog.svelte';
  import { onMount } from 'svelte';
  import StandardButton from '../StandardButton.svelte';
    import CookieDescriptionOverlay from './CookieDescriptionOverlay.svelte';

  let isCookieDialogOpen = true;
  let isDescriptionDialogOpen = false;

  const acceptClicked = () => {
    CookieManager.setComplianceChoices({
      necessary: true,
      analytics: true,
    });
    isCookieDialogOpen = false;
  };

  const rejectClicked = () => {
    CookieManager.setComplianceChoices({
      necessary: true,
      analytics: false,
    });
    isCookieDialogOpen = false;
  };

  const readMoreClicked = (e: Event) => {
    e.preventDefault();
    isDescriptionDialogOpen = true;
  };

  onMount(() => {
    isCookieDialogOpen = !CookieManager.isComplianceSet();
  });
</script>

<StandardDialog isOpen={isCookieDialogOpen} onClose={() => (isCookieDialogOpen = false)}>
  <StandardDialog
    isOpen={isDescriptionDialogOpen}
    onClose={() => (isDescriptionDialogOpen = false)}>
    <CookieDescriptionOverlay />
  </StandardDialog>
  <div out:fly class="w-200">
    <select
        class="absolute bg-white right-5 top-5 text-primarytext mr-5 pl-2 pr-2"
        bind:value={$locale}>
        {#each locales as l}
          <option value={l}>{l}</option>
        {/each}
      </select>
    <div class="ml-auto mr-auto mt-5">
      <p class="text-left p-b-10 font-bold text-warning text-3xl ml-auto mr-auto">
        {$t('cookies.banner.title')}
      </p>
    </div>
    <div class="flex w-full flex-col">
      <div class="mr-20 ml-20 mt-auto mb-auto">
        <p class="font-bold text-xl mb-2">
          {$t('cookies.banner.subtitle')}
        </p>
        <p>
          {$t('cookies.banner.text.pleaseHelp')}
        </p>
        <p>
          {$t('cookies.banner.text.description')}
        </p>
        <div class="mb-2" />
        <p>
          {$t('cookies.banner.text.readMore')}
          <a href="/" class="text-secondary font-bold" on:click={readMoreClicked}>
            {$t('cookies.banner.text.readMore.here')}
          </a>
        </p>
        <div class="mb-2" />
      </div>
    </div>
    <div class="flex mr-4 justify-end">
      <StandardButton onClick={acceptClicked}
        >{$t('cookies.banner.buttons.accept')}</StandardButton>
      <div class="mr-4" />
      <StandardButton color="warning" onClick={rejectClicked}
        >{$t('cookies.banner.buttons.reject')}</StandardButton>
    </div>
  </div>
</StandardDialog>

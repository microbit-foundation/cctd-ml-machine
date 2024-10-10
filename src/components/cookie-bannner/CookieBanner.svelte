<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { fly } from 'svelte/transition';
  import CookieManager from '../../script/CookieManager';
  import { t } from '../../i18n';
  import { locale, locales } from 'svelte-i18n';
  import StandardDialog from '../dialogs/StandardDialog.svelte';
  import { onMount } from 'svelte';
  import BaseDialog from '../dialogs/BaseDialog.svelte';
  import CookieDescriptionOverlay from './CookieDescriptionOverlay.svelte';
  import StandardButton from '../buttons/StandardButton.svelte';

  let isCookieDialogOpen: boolean;
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

<BaseDialog
  isOpen={isCookieDialogOpen}
  onClose={() => {
    return;
  }}>
  <StandardDialog
    isOpen={isDescriptionDialogOpen}
    onClose={() => (isDescriptionDialogOpen = false)}>
    <CookieDescriptionOverlay />
  </StandardDialog>
  <div out:fly class="fixed bottom-0 w-full bg-white">
    <select
      class="absolute bg-white right-5 top-5 text-primarytext ml-2 mr-2 pl-2 pr-2"
      bind:value={$locale}>
      {#each $locales as l}
        <option value={l}>{l}</option>
      {/each}
    </select>
    <div class="ml-auto mr-auto mt-5">
      <p class="text-center font-bold text-warning text-2xl ml-auto mr-auto">
        {$t('cookies.banner.title')}
      </p>
    </div>
    <div class="flex w-full mb-5">
      <div class="flex w-3/5 flex-col">
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
      <div class="flex w-2/5 flex-row mr-4 justify-center">
        <StandardButton onClick={acceptClicked}
          >{$t('cookies.banner.buttons.accept')}</StandardButton>
        <div class="mr-4" />
        <StandardButton color="warning" onClick={rejectClicked}
          >{$t('cookies.banner.buttons.reject')}</StandardButton>
      </div>
    </div>
  </div>
</BaseDialog>

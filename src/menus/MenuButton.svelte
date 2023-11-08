<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<style>
  .menu-button {
    cursor: pointer;
    margin: 0 1rem;
    min-width: 8rem;
    padding: 0.5rem 3rem;
  }

  .selected {
    border-bottom: 4px solid #00A000;
  }
</style>

<script lang="ts">
  import { t } from '../i18n';
  import Information from '../components/information/Information.svelte';

  export let title: string;
  export let helpTitle: string;
  export let helpDescription: string;
  export let onClickFunction: () => void;
  export let isExpanded: boolean;
</script>

<div
  class="menu-button"
  class:selected={isExpanded}
  on:click={onClickFunction}
>
  <div class="h-full relative">
    <p class="text-lg font-medium text-center">
      {$t(title)}
    </p>
    <div class="absolute top-3px right-12">
      <Information
        bodyText={$t(helpDescription)}
        boxOffset={{ x: -200, y: 30 }}
        titleText={$t(helpTitle)}
        width={280} />
    </div>
  </div>
  <slot />
</div>

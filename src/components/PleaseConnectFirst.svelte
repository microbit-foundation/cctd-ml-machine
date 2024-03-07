<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<style>
  .arrow-filter-color {
    filter: invert(100%) sepia(100%) saturate(100%) hue-rotate(0deg) brightness(100%)
      contrast(100%);
  }
</style>

<script lang="ts">
  import { t } from '../i18n';
</script>

<div>
  <p class="text-center text-2xl bold m-auto">
    {$t('menu.trainer.notConnected1')}
  </p>
  <p class="text-center text-2xl bold m-auto">
    {$t('menu.trainer.notConnected2')}
  </p>
  <div class="text-center ml-auto mr-auto mb-2 mt-2">
    <img
      class="m-auto arrow-filter-color"
      src="/imgs/down_arrow.svg"
      alt="down arrow icon"
      width="50px" />
  </div>
</div>

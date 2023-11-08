<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n.js';

  export let downloadDisabled = false;
  export let clearDisabled = false;
  export let onClearGestures: () => void;
  export let onDownloadGestures: () => void;
  export let onUploadGestures: () => void;
</script>

<div class="flex justify-end">
  <button
    class="mx-3"
    on:click={onDownloadGestures}
    color={'primary'}>
    {$t('content.data.controlbar.button.downloadData')}
  </button>
  <button
    class="mx-3"
    on:click={onUploadGestures}
    color="primary">
    {$t('content.data.controlbar.button.uploadData')}
  </button>
  <button
    class="mx-3"
    on:click={onClearGestures}
    color={'primary'}>
    {$t('content.data.controlbar.button.clearData')}
  </button>
</div>

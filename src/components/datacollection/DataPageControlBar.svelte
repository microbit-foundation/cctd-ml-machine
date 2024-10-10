<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import ControlBar from '../control-bar/ControlBar.svelte';
  import ExpandableControlBarMenu from '../control-bar/control-bar-items/ExpandableControlBarMenu.svelte';
  import StandardButton from '../buttons/StandardButton.svelte';
  import { t } from '../../i18n';

  export let downloadDisabled = false;
  export let clearDisabled = false;
  export let onClearGestures: () => void;
  export let onDownloadGestures: () => void;
  export let onUploadGestures: () => void;
</script>

<ControlBar>
  <StandardButton
    fillOnHover
    small
    disabled={clearDisabled}
    onClick={onClearGestures}
    bold={false}
    outlined
    shadows={false}
    color={'primary'}>
    {$t('content.data.controlbar.button.clearData')}
  </StandardButton>
  <div class="ml-2" />
  <StandardButton
    fillOnHover
    small
    disabled={downloadDisabled}
    onClick={onDownloadGestures}
    bold={false}
    outlined
    shadows={false}
    color={'primary'}>
    {$t('content.data.controlbar.button.downloadData')}
  </StandardButton>
  <div class="ml-2" />
  <StandardButton
    fillOnHover
    small
    onClick={onUploadGestures}
    bold={false}
    outlined
    shadows={false}
    color="primary">
    {$t('content.data.controlbar.button.uploadData')}
  </StandardButton>
</ControlBar>

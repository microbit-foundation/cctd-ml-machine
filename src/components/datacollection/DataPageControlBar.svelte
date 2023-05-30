<script lang="ts">
  import ControlBar from '../control-bar/ControlBar.svelte';
  import ExpandableControlBarMenu from '../control-bar/control-bar-items/ExpandableControlBarMenu.svelte';
  import StandardButton from '../StandardButton.svelte';
  import { t } from '../../i18n.js';

  export let downloadDisabled = false;
  export let clearDisabled = false;
  export let onClearGestures: () => void;
  export let onDownloadGestures: () => void;
  export let onUploadGestures: (e: Event) => void;
</script>

<ControlBar>
  <ExpandableControlBarMenu>
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
  </ExpandableControlBarMenu>
</ControlBar>

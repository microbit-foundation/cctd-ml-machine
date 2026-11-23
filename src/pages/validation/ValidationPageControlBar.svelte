<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import ControlBar from '../../components/ui/control-bar/ControlBar.svelte';
  import { tr } from '../../i18n';
  import { stores } from '../../lib/stores/Stores';
  import { onMount } from 'svelte';
  import FileUtility from '../../lib/utils/FileUtility';
  const validationSets = stores.getValidationSets();
  const gestures = stores.getGestures();
  $: isClearDisabled =
    $validationSets.length === 0 ||
    $validationSets.map(e => e.recordings.length).reduce((pre, cur) => pre + cur, 0) ===
      0;
  const clearValidationSets = () =>
    confirm($tr('content.data.controlbar.button.clearData.confirm')) &&
    validationSets.clear();

  const downloadValidationSets = () =>
    FileUtility.downloadValidationSets(validationSets.exportSets());

  const uploadValidationSets = () => filePicker.click();

  let filePicker: HTMLInputElement;
  onMount(() => {
    filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.accept = 'application/JSON';
    filePicker.onchange = () => {
      if (filePicker.files == null || filePicker.files.length < 1) {
        return;
      }
      FileUtility.loadValidationSetsFromFile(
        filePicker.files[0],
        result => {
          if (result.skippedSets.length > 0) {
            alert(
              $tr('content.validation.upload.skipped', {
                values: { names: result.skippedSets.join(', ') },
              }),
            );
          }
        },
        () => alert($tr('content.validation.upload.error')),
      );
      filePicker.value = ''; // To trick element to trigger onChange if same file selected
    };
    return () => {
      filePicker.remove();
    };
  });
</script>

<ControlBar>
  <StandardButton
    fillOnHover
    small
    disabled={isClearDisabled}
    onClick={clearValidationSets}
    bold={false}
    outlined
    shadows={false}
    color={'primary'}>
    {$tr('content.validation.clearValidations')}
  </StandardButton>
  <div class="ml-2" />
  <StandardButton
    fillOnHover
    small
    disabled={isClearDisabled}
    onClick={downloadValidationSets}
    bold={false}
    outlined
    shadows={false}
    color={'primary'}>
    {$tr('content.validation.downloadValidations')}
  </StandardButton>
  <div class="ml-2" />
  <StandardButton
    fillOnHover
    small
    disabled={$gestures.length === 0}
    onClick={uploadValidationSets}
    bold={false}
    outlined
    shadows={false}
    color={'primary'}>
    {$tr('content.validation.uploadValidations')}
  </StandardButton>
</ControlBar>

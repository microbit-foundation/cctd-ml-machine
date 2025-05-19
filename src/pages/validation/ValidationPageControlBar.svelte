<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import ControlBar from '../../components/ui/control-bar/ControlBar.svelte';
  import { tr } from '../../i18n';
  import { stores } from '../../lib/stores/Stores';
  const validationSets = stores.getValidationSets();
  $: isClearDisabled =
    $validationSets.length === 0 ||
    $validationSets.map(e => e.recordings.length).reduce((pre, cur) => pre + cur, 0) ===
      0;
  const clearValidationSets = () =>
    confirm($tr('content.data.controlbar.button.clearData.confirm')) &&
    validationSets.clear();
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
</ControlBar>

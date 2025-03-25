<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
    import StandardButton from '../../components/buttons/StandardButton.svelte';
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
    import { stores } from '../../script/stores/Stores';
  const validationSets = stores.getValidationSets();
  $: isClearDisabled = $validationSets.length === 0;
  const clearValidationSets = () => validationSets.clear();
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
    Clear validation sets
  </StandardButton>
</ControlBar>

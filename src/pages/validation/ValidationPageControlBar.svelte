<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import StandardButton from '../../components/ui/buttons/StandardButton.svelte';
  import ControlBar from '../../components/ui/control-bar/ControlBar.svelte';
  import { tr } from '../../i18n';

  const gestureController = getControllers().getGestureController();

  const validationRecordings = gestureController.getValidationRecordings();

  const isClearDisabled = $validationRecordings.length === 0;
  const clearValidationRecordings = () =>
    confirm($tr('content.data.controlbar.button.clearData.confirm')) &&
    gestureController.clearValidationRecordings();
</script>

<ControlBar>
  <StandardButton
    fillOnHover
    small
    disabled={isClearDisabled}
    onClick={clearValidationRecordings}
    bold={false}
    outlined
    shadows={false}
    color={'primary'}>
    {$tr('content.validation.clearValidations')}
  </StandardButton>
</ControlBar>

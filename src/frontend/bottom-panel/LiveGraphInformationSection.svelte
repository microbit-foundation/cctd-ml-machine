<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import { tr } from '../../i18n';
  import { Feature, hasFeature } from '../lib/FeatureToggles';
  import Information from '../components/information/Information.svelte';
  import BottomPanelLiveDataValues from './BottomPanelLiveDataValues.svelte';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
</script>

<div class="flex flex-row">
  <div>
    <Information
      titleText={$tr('footer.helpHeader')}
      bodyText={$tr('footer.helpContent')}
      isLightTheme={false}
      boxOffset={{ x: 25, y: -150 }} />
  </div>
  <p class="float-left ml-6">Live</p>
  <p
    class="float-left ml-1 -mt-3 text-3xl"
    class:text-red-500={$microbitConnection.getInput().isReady()}
    class:text-gray-500={!$microbitConnection.getInput().isReady()}>
    &#x2022;
  </p>
  {#if hasFeature(Feature.LIVE_GRAPH_INPUT_VALUES)}
    <div class="ml-6">
      <BottomPanelLiveDataValues />
    </div>
  {/if}
</div>

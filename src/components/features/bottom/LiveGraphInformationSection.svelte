<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { tr } from '../../../i18n';
  import { Feature, hasFeature } from '../../../lib/FeatureToggles';
  import { state } from '../../../lib/stores/Stores';
  import Information from '../../ui/information/Information.svelte';
  import BottomPanelLiveDataValues from './BottomPanelLiveDataValues.svelte';
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
    class:text-red-500={$state.isInputReady}
    class:text-gray-500={!$state.isInputReady}>
    &#x2022;
  </p>
  {#if hasFeature(Feature.LIVE_GRAPH_INPUT_VALUES)}
    <div class="ml-6">
      <BottomPanelLiveDataValues />
    </div>
  {/if}
</div>

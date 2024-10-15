<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import { Feature, hasFeature } from '../../script/FeatureToggles';
  import SmoothedLiveData from '../../script/livedata/SmoothedLiveData';
  import { stores } from '../../script/stores/Stores';
  import { state } from '../../script/stores/uiStore';
  import StaticConfiguration from '../../StaticConfiguration';
  import Information from '../information/Information.svelte';

  const liveData = new SmoothedLiveData($stores.liveData, 3);
  $: input = $liveData.getVector();
  $: labels = $liveData.getLabels();
</script>

<div class="flex flex-row">
  <div>
    <Information
      titleText={$t('footer.helpHeader')}
      bodyText={$t('footer.helpContent')}
      isLightTheme={false}
      boxOffset={{ x: 25, y: -150 }} />
  </div>
  <p class="float-left ml-10">Live</p>
  <p
    class="float-left ml-1 -mt-3 text-3xl"
    class:text-red-500={$state.isInputReady}
    class:text-gray-500={!$state.isInputReady}>
    &#x2022;
  </p>
  {#if hasFeature(Feature.LIVE_GRAPH_INPUT_VALUES)}
    <div class="ml-8 flex flex-row w-50 justify-between">
      {#each input as inputValue, i}
        <div class="w-16">
          <p style={'color: ' + StaticConfiguration.liveGraphColors[i] + ';'}>
            {labels[i]}: {inputValue.toFixed(2)}
          </p>
        </div>
      {/each}
    </div>
  {/if}
</div>

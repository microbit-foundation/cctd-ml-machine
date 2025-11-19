<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
    import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import { stores } from '../../../lib/stores/Stores';
  import StaticConfiguration from '../../../StaticConfiguration';
  import LiveGraph from './LiveGraph.svelte';

  const controllers = getControllers();
  const axisController = controllers.getAxisController()
  const dataController = controllers.getDataController();

  const liveData = dataController.getLiveData();
  const selectedAxes = axisController.getSelectedAxes();
  export let width: number;
</script>

{#if liveData != null}
  {#key $selectedAxes.map(e => `${e.index}`).join('-')}
    <LiveGraph
      minValue={StaticConfiguration.liveGraphValueBounds.min}
      maxValue={StaticConfiguration.liveGraphValueBounds.max}
      liveDataState={liveData}
      {width} />
  {/key}
{/if}

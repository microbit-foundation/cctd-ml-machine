<!--
  (c) 2023-2025, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->

<script lang="ts">
  import ModelRegistry from '../../../lib/domain/ModelRegistry';
  import { stores } from '../../../lib/stores/Stores';
  import KnnModelSettings from './KNNModelSettings.svelte';
  import NeuralNetworkSettings from './NeuralNetworkSettings.svelte';

  const selectedModel = stores.getSelectedModel();
</script>

<div class="flex justify-center">
  {#if $selectedModel.id === ModelRegistry.NeuralNetwork.id}{:else}{/if}
</div>

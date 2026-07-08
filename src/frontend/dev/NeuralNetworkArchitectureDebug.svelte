<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';

  export let settings: NeuralNetworkModelSettings;

  $: architecture = settings.getArchitecture();
  $: inputLayer = tryGetLayer(() => architecture.getInputLayer());
  $: hiddenLayers = tryGetLayer(() => architecture.getHiddenLayers()) ?? [];
  $: outputLayer = tryGetLayer(() => architecture.getOutputLayer());

  function tryGetLayer<T>(fn: () => T): T | undefined {
    try {
      return fn();
    } catch (e) {
      return undefined;
    }
  }
</script>

<div class="mt-2 border-t border-violet-300 pt-2 font-mono text-xs">
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-1">
      <span class="bg-blue-100 px-1 rounded">IN:</span>
      <span>{inputLayer ? inputLayer.getNumberOfNodes() : 'unknown'} nodes</span>
    </div>

    {#each hiddenLayers as layer, i}
      <div class="flex items-center gap-1">
        <span class="bg-gray-100 px-1 rounded">H{i + 1}:</span>
        <span>{layer.getNumberOfNodes()} nodes</span>
      </div>
    {/each}

    <div class="flex items-center gap-1">
      <span class="bg-red-100 px-1 rounded">OUT:</span>
      <span>{outputLayer ? outputLayer.getNumberOfNodes() : 'unknown'} nodes</span>
    </div>
  </div>
</div>

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import { compatibility } from '../../script/stores/uiStore';
  import View3DUnsafe from './View3DUnsafe.svelte';
  import { Vector3 } from './View3DUtility';

  export let smoothing = false;
  export let width: number;
  export let height: number;
  export let dataPoint: Vector3;

  const webGlCompatible = $compatibility.webGL;
</script>

{#if webGlCompatible}
  <View3DUnsafe {smoothing} {width} {height} {dataPoint} />
{:else}
  <div
    class="justify-center items-center align-middle flex text-center"
    style="height: {height}px; width: {width}px;">
    <div style="height: min-content">
      {$t('compatibility.webgl.notSupported')}
    </div>
  </div>
{/if}

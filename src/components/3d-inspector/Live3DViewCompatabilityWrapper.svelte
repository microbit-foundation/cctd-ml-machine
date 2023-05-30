<script lang="ts">
    import { t } from "../../i18n";
  import { compatibility } from "../../script/stores/uiStore";
  import Live3DView from "./Live3DView.svelte";

  export let smoothing = false;
  export let width: number;
  export let height: number;

  const webGlCompatible = $compatibility.webGL
</script>

{#if webGlCompatible}
  <Live3DView 
    smoothing={smoothing}
    width={width}
    height={height}
  />
{:else}
  <div 
    class="justify-center items-center align-middle flex text-center"
    style="height: {height}px; width: {width}px;"
  >
    <div style="height: min-content">
      {$t("compatibility.webgl.notSupported")}
    </div>
  </div>
{/if}

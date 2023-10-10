<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { horizontalSlide } from '../script/transitions';
  import StandardButton from './StandardButton.svelte';
  import { state } from '../script/stores/uiStore';
  import { t } from '../i18n';
    import Microbits from '../script/microbit-interfacing/Microbits';
  let hasBeenIgnored = false;
  export let targetRole: "INPUT" | "OUTPUT"

  const updateNowHasBeenClicked = () => {
    let microbitVersion = targetRole === "INPUT" ? Microbits.getInputVersion() : Microbits.getOutputVersion();
    let microbitOrigin = targetRole === "INPUT" ? Microbits.getInputOrigin() : Microbits.getOutputOrigin();
  }
</script>

{#if !hasBeenIgnored}
<div
  class="absolute top-8 right-4 bg-white rounded-md p-6 border-1 border-black z-5"
  transition:horizontalSlide>
  <div class="w-100">
    <div class="absolute right-2 top-2 svelte-1rnkjvh">
      <button on:click={() => hasBeenIgnored = true}
        class="hover:bg-gray-100 rounded outline-transparent w-8 svelte-1rnkjvh">
        <i
          class="fas fa-plus text-lg text-gray-600 hover:text-gray-800 duration-75 svelte-1rnkjvh"
          style="transform: rotate(45deg);" />
      </button>
    </div>
    <p class="text-warning font-bold">{$t("popup.outdatedmicrobit.header")}</p>
    <p>{$t("popup.outdatedmicrobit.text")}</p>
    <div class="flex mt-5 justify-center">
      <StandardButton onClick={() => hasBeenIgnored=true}>{$t("popup.outdatedmicrobit.button.later")}</StandardButton>
      <div class="w-3"/>
      <StandardButton onClick={updateNowHasBeenClicked}>{$t("popup.outdatedmicrobit.button.update")}</StandardButton>
    </div>
  </div>
</div>
{/if}

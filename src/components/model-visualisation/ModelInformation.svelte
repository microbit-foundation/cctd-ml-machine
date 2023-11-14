<script lang="ts">
  import { state } from "../../script/common";
  import { fade } from "svelte/transition";
  import { modelInformation } from "./utility/modelInformation";
  import { t } from "../../i18n";
  import Information from "../Information.svelte";

  // TODO: Make names dependent on i18n translation
  $: information = [
    {
      name: $t("content.trainer.inputs.header"),
      help: $t("content.trainer.inputs.help"),
      value: $modelInformation.amountOfParameters,
      icon: "fas fa-sign-in-alt",
    },
    {
      name: $t("content.trainer.outputs.header"),
      help: $t("content.trainer.outputs.help"),
      value: $modelInformation.amountOfGestures,
      icon: "fas fa-sign-out-alt",
    },
    {
      name: $t("content.trainer.precision.header"),
      help: $t("content.trainer.precision.help"),
      value: $modelInformation.precision,
      icon: "fas fa-crosshairs",
    },
    {
      name: $t("content.trainer.energy.header"),
      help: $t("content.trainer.energy.help"),
      value: $modelInformation.energy,
      icon: "fas fa-bolt",
    },
  ];
</script>

<!-- If predicting add this menu with a some information about the model -->
{#if $state.isPredicting}
  <div class="relative z-10">
    <div
      out:fade|local
      class="absolute left-5 top-5 w-50 bg-white rounded-lg shadow-inset p-4"
    >
      <!-- Title-->
      <p class="text-gray-600 w-full font-semibold text-center mb-4">Model</p>

      <!-- A set of values that describe information about the model -->
      {#each information as entry}
        <div class="justify-between mb-4 flex">
          <!-- Logo, name & question-mark to learn more -->
          <div class="text-gray-800 flex z-1">
            <i
              class="{entry.icon} text-gray-400 w-7 -ml-2 mt-1 text-center"
            />{entry.name}
            <div class="relative">
              <Information
                data={entry.help}
                title={entry.name}
                width="20"
                style="transform: translateX(.5rem);"
                right
              />
            </div>
          </div>

          <!-- Illustrates a value that describes the model -->
          <div class="relative">
            <p class="animate-fade-in animate-duration-200">{entry.value}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .shadow-inset {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  }
</style>

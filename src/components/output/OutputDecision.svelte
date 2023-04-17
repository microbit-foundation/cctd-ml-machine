<!-- <script lang="ts">
  import Selector from "./Selector.svelte";
  import Pin from "./Pin.svelte";
  import Sound from "./Sound.svelte";
  import { t } from "../../i18n"
    import type { GestureData } from "../../script/stores/mlStore";

  export let gesture: GestureData;
  export let trigger = null;

  // Possible outputs
  const changeOptions = [
    {
      name: $t("content.model.output.optionPin"),
      component: Pin,
      id: 0,
    },
    {
      name: $t("content.model.output.optionSound"),
      component: Sound,
      id: 1, 
    },
  ];

  // Ensure that if no output is present in gesture. An empty object is added
  // if (gesture.output === undefined) gesture.output = {};

  // Save and load variable from gesture
  let chosen = gesture.output.option
    ? changeOptions[gesture.output.option]
    : changeOptions[0];
  $: gesture.output.option = chosen.id;
</script>

<main class="flex items-center ml-8">
  <Selector options={changeOptions} title={$t("content.model.output.affect")} bind:chosen />
  <i class="fas fa-chevron-right text-dark-200 m-4" />
  <svelte:component this={chosen.component} bind:trigger={trigger} {gesture} />
</main> -->

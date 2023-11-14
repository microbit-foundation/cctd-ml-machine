<script lang="ts">
  import { fade } from "svelte/transition";
  import { t } from "../../../i18n";  
  import { gestures } from '../../../script/stores/Stores';
  import { state } from '../../../script/stores/uiStore';
  import { settings} from '../../../script/stores/mlStore';
  import type { IllustratedModelOffset } from "../utility/modelVisualisation";
  import LabelContainer from "./LabelContainer.svelte";
  import "../utility/animations.css";
  import { determineFilter } from '../../../script/datafunctions';
  
  
  export let offset: IllustratedModelOffset;

  // To get names from i18n, the names need to be fetched from this array.
  const LANG_FILTER_NAMES = [
    "content.trainer.filters.max.heading",
    "content.trainer.filters.min.heading",
    "content.trainer.filters.standardDev.heading",
    "content.trainer.filter.extremes.heading",
    "content.trainer.filter.acc.heading",
  ];

  //Create filter names based on active parameters and current language
  let filterNames: string[] = [];
  $settings.includedFilters.forEach((filter) => {
    filterNames.push(determineFilter(filter).getText().name);
  });
    

  // Variables for alignment.
  const FILTER_RADIAN_OFFSET = Math.pow(0.43, filterNames.length) * 2.8 + 3.5;
  const GESTURE_RADIAN_OFFSET = 2.5 / ($gestures.length * 1.7) + 0.1;
</script>

{#if $state.isPredicting}
  <div
    in:fade={{ delay: 500 }}
    out:fade={{ duration: 300 }}
    class="w-110 h-110 -top-5 left-20 absolute"
  >
    <div class="relative">
      <!-- Draw out all filter labels -->
      {#each filterNames as filter, index}
        <LabelContainer
          {index}
          amount={filterNames.length}
          radianOffset={FILTER_RADIAN_OFFSET}
          offsetRotation={-offset.rotation}
          colorIndex={index * 2}
          translateX={-100}
        >
          {filter}
        </LabelContainer>
      {/each}

      <!--
        Labels are reversed to align with nodes.
        We are taking a slice of the original gestures array
        As we wish not to manipulate the original array.
      -->
      {#each $gestures.slice().reverse() as gesture, index}
        <LabelContainer
          {index}
          amount={$gestures.length}
          radianOffset={GESTURE_RADIAN_OFFSET}
          offsetRotation={-offset.rotation}
          colorIndex={9 + $gestures.length - index}
        >
          {gesture.name}
        </LabelContainer>
      {/each}
    </div>
  </div>
{/if}

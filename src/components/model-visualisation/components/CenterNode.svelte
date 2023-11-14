<script lang="ts">
  import { onDestroy } from "svelte";
  import { state } from '../../../script/stores/uiStore';
  import {
    BooleanEffectTrigger,
    type AnimationLoop,
  } from "../utility/animationLoop";
  import type { IllustratedModelNode } from "../utility/modelVisualisation";
  export let model: IllustratedModelNode;
  export let animationLoop: AnimationLoop;
  export let isTraining: boolean; // Used as an animation to cover everything

  // model size changes as the illustrated model node changes its values.
  // The large size that covers other nodes during training is a product of values changed within currentTrainingState
  $: size = isTraining ? 28 : model.size;
  $: leftDistance = 18.75 - size / 2;
  $: topDistance = 12.5 - size / 2;

  // Get animation effect that triggers chewing animation
  let { animationEffect, value } = new BooleanEffectTrigger(650, 1000);

  animationLoop.addEffect(animationEffect);
  onDestroy(() => {
    animationLoop.removeEffect(animationEffect);
  });
</script>

<div
  class:animate-model-chewing={$value}
  class="absolute rounded-1 duration-500 ease"
  class:bg-blue-300={isTraining}
  class:bg-blue-400={!isTraining}
  style="height: {size}rem; width: {size}rem; left: {leftDistance}rem; top: {topDistance}rem;"
/>

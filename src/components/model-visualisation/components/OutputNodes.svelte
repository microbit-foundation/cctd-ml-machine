<script lang="ts">
  import { onDestroy } from "svelte";
  import type { IllustratedModel } from "../utility/modelVisualisation";
  import "../utility/animations.css";
  import {
    AnimationEffect,
    BooleanEffectTrigger,
    type AnimationLoop,
  } from "../utility/animationLoop";
  import GenericNode from "./GenericNode.svelte";
  import {
    classifySync,
    getIndexOfGreatestPrediction,
  } from "../../../script/ml";
  export let model: IllustratedModel;
  export let animationLoop: AnimationLoop;

  // AnimationEffect for animating the edge
  let { animationEffect: animationEffectEdge, value: animateEdge } =
    new BooleanEffectTrigger(950, 500);

  // AnimationEffect for animating the node
  let { animationEffect, value: animateNode } = new BooleanEffectTrigger(
    1350,
    500
  );

  // AnimationEffect for animating the winning node.
  let celebratingNodeIndex = -1;

  let winnerAnimationEffect = new AnimationEffect({
    onAnimate: () => {
      celebratingNodeIndex = getIndexOfGreatestPrediction(classifySync());
    },
    onFinished: () => {
      celebratingNodeIndex = -1;
    },
    onStop: () => {
      celebratingNodeIndex = -1;
    },
    duration: 1500,
    delay: 1350,
  });

  // Add effects to animation loop and remove on destroy.
  animationLoop.addEffect(
    animationEffect,
    animationEffectEdge,
    winnerAnimationEffect
  );
  onDestroy(() => {
    animationLoop.removeEffect(
      animationEffect,
      animationEffectEdge,
      winnerAnimationEffect
    );
  });
</script>

{#each model.outputs as node, index}
  <GenericNode
    {node}
    {index}
    amountOfNodes={model.outputs.length}
    animateNode={$animateNode}
    animateEdge={$animateEdge}
    isOutput
  >
    <!-- Add flag animation. let:XXX refers to props passed from Generic Node -->
    <div
      slot="label"
      let:nodeTop
      let:nodeLeft
      let:rotation
      let:nodeSize
      class="absolute text-sm"
      style="top: {nodeTop + nodeSize / 2}rem; left: {nodeLeft +
        +nodeSize / 2}rem; transform: rotate({-rotation -
        model.modelOffset.rotation}deg); color: {node.nodeColor};"
    >
      <div style="transform: translateY({-1.5 - nodeSize / 2}rem);">
        <i
          class="absolute text-xl fas fa-flag opacity-0"
          class:animate-winner-flag={index === celebratingNodeIndex}
        />
      </div>
    </div>
  </GenericNode>
{/each}

<script lang="ts">
  import { onDestroy } from "svelte";
  import type { IllustratedModel } from "../utility/modelVisualisation";
  import "../utility/animations.css";
  import GenericNode from "./GenericNode.svelte";
  import {
    AnimationLoop,
    BooleanEffectTrigger,
  } from "../utility/animationLoop";

  export let model: IllustratedModel;
  export let animationLoop: AnimationLoop;

  // Get animation effect that triggers boolean
  let { animationEffect: animationEffectEdge, value: animateEdge } =
    new BooleanEffectTrigger(200, 500);

  let { animationEffect, value: animateNode } = new BooleanEffectTrigger(
    0,
    500
  );

  animationLoop.addEffect(animationEffect, animationEffectEdge);
  onDestroy(() => {
    animationLoop.removeEffect(animationEffect, animationEffectEdge);
  });

  // Dimensions are in reverse order as input-nodes are drawn from bottom to top
  // This is not the case for output nodes. They're drawn from top to bottom
  const dimensions = ["z", "y", "x"];
</script>

<!-- inputs are reversed, as the input-nodes are drawn from bottom to top -->
<!-- This is not the case for output nodes. They're drawn from top to bottom -->
{#each model.inputs.reverse() as node, index}
  <GenericNode
    {node}
    {index}
    amountOfNodes={model.inputs.length}
    animateNode={$animateNode}
    animateEdge={$animateEdge}
  >
    <!-- Add dimension. let:XXX refers to props passed from Generic Node -->
    <p
      slot="label"
      let:nodeTop
      let:nodeLeft
      let:rotation
      class="absolute text-sm"
      style="top: {nodeTop}rem; left: {nodeLeft -
        1}rem; transform: rotate({-rotation -
        model.modelOffset.rotation}deg); color: {node.nodeColor};"
    >
      {dimensions[index % 3]}
    </p>
  </GenericNode>
{/each}

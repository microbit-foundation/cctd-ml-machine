<script lang="ts">
  import type { IllustratedNode } from "../utility/modelVisualisation";

  export let node: IllustratedNode;
  export let amountOfNodes: number;
  export let animateNode: boolean;
  export let animateEdge: boolean;
  export let isOutput: boolean = false;
  export let index: number;

  /**
   * Calculates the rotation (degrees) based on values passed in.
   * @param node provides a value called heightOffset, that is used to offset the node a little, to make it look more organic
   * @param index Used to find its primary rotation amount all other nodes
   * @param amountOfNodes Lets function know how many other nodes, that the
   * @param isOutput Flips node 180 degrees, to place on opposite side
   */
  function getRotation(
    node: IllustratedNode,
    index: number,
    isOutput: boolean,
    amountOfNodes: number
  ): number {
    const stepIndex = index - (amountOfNodes - 1) / 2;
    const stepSize = 160 / amountOfNodes;
    const heightOffset = node.heightOffset * (70 / amountOfNodes);
    const isOutputOffset = isOutput ? 180 : 0;

    return stepIndex * stepSize + heightOffset - isOutputOffset;
  }

  function getAnimatedEdgeLeft(animateEdge: boolean) {
    if (isOutput == animateEdge) return node.length * 6;
    return 12;
  }

  $: rotation = getRotation(node, index, isOutput, amountOfNodes);

  // Attributes for moving animation on Edge
  $: animatedEdgeLeft = getAnimatedEdgeLeft(animateEdge);
  $: animatedEdgeTop = 1.5 - Math.max(node.size, 0.5) / 2;
  $: animatedEdgeSize = Math.max(node.size, 0.5);

  // Attributes for edge
  $: edgeWidth = 12.5 - node.length * 6;
  $: edgeHeight = 0.15 + node.width * 0.3;
  $: edgeTop = 1.5 - (0.15 + node.width * 0.3) / 2;
  $: edgeLeft = node.length * 6 + 0.25;

  // Attributes for node
  $: nodeSize = node.size * 2;
  $: nodeTop = 1.5 - node.size;
  $: nodeLeft = node.length * 6;
</script>

<!-- Following Div handles rotation of node -->
<div
  class="w-100 ml-25 mt-44 absolute h-12 duration-300 ease-out"
  style="transform: rotate({rotation}deg);"
>
  <div class="w-100 h-12 relative">
    <!-- Edge from node to model -->
    <div
      class="absolute duration-500 ease-out"
      style="width: {edgeWidth}rem; height: {edgeHeight}rem; top: {edgeTop}rem; left: {edgeLeft}rem; background-color: {node.borderColor};"
    />

    <!-- Animate moving circle from node to model -->
    <div
      class:duration-500={animateEdge}
      class="rounded-1 absolute ease-linear"
      style="width: {animatedEdgeSize}rem; height: {animatedEdgeSize}rem;
      top: {animatedEdgeTop}rem; left: {animatedEdgeLeft}rem;
        background-color: {node.nodeColor};"
    />

    <!-- Paint the node itself -->
    <div
      class:input-node-bubble-animation={animateNode && !isOutput}
      class:output-node-bubble-animation={animateNode && isOutput}
      class="rounded-1 absolute duration-500 ease-out"
      style="width: {nodeSize}rem; height: {nodeSize}rem; top: {nodeTop}rem; left: {nodeLeft}rem;
        background-color: {node.nodeColor};"
    />

    <!-- Add extra label -->
    {#if $$slots.label}
      <slot name="label" {nodeTop} {nodeLeft} {rotation} {nodeSize} />
    {/if}
  </div>
</div>

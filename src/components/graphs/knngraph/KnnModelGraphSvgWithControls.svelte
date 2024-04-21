<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import KNNModelGraphController from './KNNModelGraphController';

  export let controller: KNNModelGraphController | undefined;
  export let classID: string;
  export let width: number;
  export let height: number;
  export let hidden: boolean;

  const zoom = (amount: number) => {
    if (!controller) {
      return;
    }
    controller.multiplyScale(amount);
  };

  let mouseDragDelta = {
    x: 0,
    y: 0,
  };

  let isDragging = false;

  const dragStart = () => {
    isDragging = true;
  };

  const dragEnd = (event: any) => {
    if (!isDragging) return;
    if (event.type !== 'mouseup') {
      if (!event.relatedTarget.className) return;
      if (typeof event.relatedTarget.className === 'string') {
        if (event.relatedTarget.className.includes(classID)) {
          return;
        }
      } else {
        if (event.relatedTarget.className.baseVal.includes(classID)) {
          return;
        }
      }
    }

    isDragging = false;
  };

  const drag = (event: any) => {
    if (!isDragging) return;
    if (!controller) {
      return;
    }
    mouseDragDelta = {
      x: event.movementX,
      y: event.movementY,
    };

    controller.addRotation({
      x: (mouseDragDelta.y * -0.04) / Math.PI,
      y: (mouseDragDelta.x * -0.04) / Math.PI,
      z: 0,
    });
  };
</script>

<div class:hidden>
  <button class="border-primary border-1 px-3" on:click={() => zoom(1.25)}>+</button>
  <button class="border-primary border-1 px-3" on:click={() => zoom(0.75)}>-</button>
  <!-- CONTAINER FOR TOOLTIP. IS MOVED BY GRAPHDRAWER -->
  <svg
    class={classID}
    {width}
    {height}
    on:mousedown={dragStart}
    on:mouseup={dragEnd}
    on:mousemove={drag}
    on:mouseout={dragEnd}
    on:mouseleave={dragEnd}
    on:blur={dragEnd} />
</div>

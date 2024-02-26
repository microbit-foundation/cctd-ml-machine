<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
 <script lang="ts">
  import { onMount } from 'svelte';
  import KNNModelGraphController from './KNNModelGraphController';
  import * as d3 from 'd3';
  import { classifier, gestures } from '../../../script/stores/Stores';
  import ClassifierFactory from '../../../script/domain/ClassifierFactory';
  import { FilterType } from '../../../script/domain/FilterTypes';

  export let controller: KNNModelGraphController | undefined;
  export let classID: string;
  export let width: number;
  export let height: number;

  const zoom = (amount: number) => {
    if (!controller) {
      return;
    }
    controller.multiplyScale(amount);
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

    const delta = {
      x: event.movementX,
      y: event.movementY,
    };

    if (!controller) {
      return;
    }
    controller.addRotation({
      x: (delta.y * 0.05) / Math.PI,
      y: (delta.x * -0.05) / Math.PI,
      z: 0,
    });
  };
</script>

  <button class="border-primary border-1 px-3" on:click={() => zoom(1.25)}>+</button>
  <button class="border-primary border-1 px-3" on:click={() => zoom(0.75)}>-</button>
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

<script lang="ts">
  import { onMount } from 'svelte';
  import KNNModelGraphController from './KNNModelGraphController';
  import * as d3 from 'd3';
  import { classifier, gestures } from '../../../script/stores/Stores';
  import ClassifierFactory from '../../../script/domain/ClassifierFactory';
  import { FilterType } from '../../../script/domain/FilterTypes';

  let controller: KNNModelGraphController | undefined;

  onMount(() => {
    const svg = d3.selectAll('.d3-3d');
    classifier.getFilters().clear();
    classifier.getFilters().add(FilterType.MAX);
    classifier.getFilters().add(FilterType.MIN);
    classifier.getFilters().add(FilterType.MEAN);
    controller = new KNNModelGraphController(svg, () => {
      const classifierFactory = new ClassifierFactory();
      return classifierFactory.buildTrainingData(
        gestures.getGestures(),
        classifier.getFilters(),
      );
    });
  });

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
        if (event.relatedTarget.className.includes('d3-3d')) {
          return;
        }
      } else {
        if (event.relatedTarget.className.baseVal.includes('d3-3d')) {
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

<div class="pt-2">
  <button class="border-primary border-1 px-3" on:click={() => zoom(1.25)}>+</button>
  <button class="border-primary border-1 px-3" on:click={() => zoom(0.75)}>-</button>
  <svg
    class="d3-3d"
    width="500"
    height="500"
    on:mousedown={dragStart}
    on:mouseup={dragEnd}
    on:mousemove={drag}
    on:mouseout={dragEnd}
    on:mouseleave={dragEnd}
    on:blur={dragEnd} />
</div>

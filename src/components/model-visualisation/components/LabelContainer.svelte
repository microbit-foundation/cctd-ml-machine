<script lang="ts">
  import { colorArray } from "../../../script/utils/colors";

  const HEIGHT_OF_CONTENT = 27.5; // Illustrated in rem;
  const OFFSET = 1;
  const CIRCLE_RADIUS = HEIGHT_OF_CONTENT / 2 + OFFSET;

  export let index: number; // The index of the label. Used to determine it's position
  export let amount: number; // how many other labels are there
  export let radianOffset: number; // To ensure horizontal text, adjust for rotation of node
  export let offsetRotation: number; // To ensure horizontal text, adjust for OffsetContainer rotation
  export let translateX = 0; // Depending on the container, there might be an X-offset.
  export let colorIndex: number; // Color index of the labels text.

  // Defines the step size between each label in radian.
  const radianStep = ((167 / 180) * Math.PI) / amount;

  $: sin = Math.sin(radianOffset + radianStep * index);
  $: cos = Math.cos(radianOffset + radianStep * index);

  $: top = cos + 1;
  $: left = sin + 1;
</script>

<div
  class="absolute select-none"
  style="top: {top * CIRCLE_RADIUS - OFFSET}rem; left: {left * CIRCLE_RADIUS -
    OFFSET}rem;"
>
  <p
    class="text-xs p-2 bg-white rounded-2xl duration-200 shadow-md shadow-black"
    style=" transform-origin: {translateX + 50}% 0%;
    transform: rotate({offsetRotation}deg) translate({translateX}%, -50%); color: {colorArray[
      colorIndex
    ].f400};"
  >
    <slot />
  </p>
</div>

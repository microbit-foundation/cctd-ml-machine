<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { getInfoBoxColors } from './Information';

  export let underlineIconText = true;
  export let boxOffset: { x: number; y: number } = { x: 0, y: 0 };
  export let width = 300;
  export let isLightTheme = true;

  export let iconText: string | undefined = undefined;
  export let titleText: string | undefined = undefined;
  export let bodyText: string | undefined = undefined;

  const colors = getInfoBoxColors(isLightTheme);

  let isOpen = false;

  let w: number;
  let h: number;

  let boxTop = 0;
  let boxLeft = 0;

  let domNode: HTMLElement;

  function onMouseEnter(): void {
    let domRect: DOMRect = domNode.getBoundingClientRect();
    boxTop = h + 5 + boxOffset.y + domRect.y; // hardcoded values to provide a 'nice' starting point
    boxLeft = w - 20 + boxOffset.x + domRect.x;
    isOpen = true;
  }
</script>

<div
  class="cursor-pointer w-auto flex"
  on:mouseenter={() => onMouseEnter()}
  on:mouseleave={() => (isOpen = false)}
  bind:clientWidth={w}
  bind:clientHeight={h}
  bind:this={domNode}>
  {#if iconText !== undefined}
    <p
      class="text-white w-auto h-auto mr-0 whitespace-pre-line"
      class:underline={underlineIconText}
      style="color: {colors.iconTextColor}">
      {iconText}
    </p>
  {/if}

  <i
    class="far fa-question-circle flex text-white
             w-auto h-auto mr-0 ml-1 mt-4px"
    class:hovering={isOpen}
    style="color: {colors.iconColor}" />

  {#if isOpen}
    <div
      class="fixed z-10 rounded-md p-3 cursor-default"
      style="top: {boxTop}px; left: {boxLeft}px; width: {width}px; background-color:{colors.backgroundColor}"
      on:click|stopPropagation>
      {#if titleText}
        <p
          class="font-bold text-left mb-1 mt-1 text-sm"
          style="color: {colors.textColor}">
          {titleText}
        </p>
      {/if}
      {#if bodyText}
        <p
          class="text-sm text-left"
          style="color: {colors.textColor}"
          class:blackText={isLightTheme}
          class:whiteText={!isLightTheme}>
          {bodyText}
        </p>
      {/if}
      <slot />
    </div>
  {/if}
</div>

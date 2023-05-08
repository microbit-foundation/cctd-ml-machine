<style>
  .hovering {
    transition: 0.2s ease;
    transform: scale(1.3);
  }
  .underline {
    text-decoration: underline;
  }
</style>

<script lang="ts">
  import { getInfoBoxColors } from '../../script/InformationComponentUtility';

  export let text: string | undefined = undefined;
  export let underlineText = true;
  export let isLightTheme = true;
  export let boxOffset: { x: number; y: number } = { x: 0, y: 0 };
  export let width = 300;

  const colors = getInfoBoxColors(isLightTheme);

  const backgroundColor = colors.backgroundColor;
  const iconColor = colors.iconColor;
  const iconTextColor = colors.iconTextColor;

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
  {#if text !== undefined}
    <p
      class="text-white w-auto h-auto mr-0 whitespace-pre-line"
      class:underline={underlineText}
      style="color: {iconTextColor}">
      {text}
    </p>
  {/if}

  <i
    class="far fa-question-circle flex text-white
             w-auto h-auto mr-0 ml-1 mt-4px"
    class:hovering={isOpen}
    style="color: {iconColor}" />

  {#if isOpen}
    <div
      class="fixed z-10 rounded-md p-3 cursor-default"
      style="top: {boxTop}px; left: {boxLeft}px; width: {width}px; background-color:{backgroundColor}"
      on:click|stopPropagation>
      <slot />
    </div>
  {/if}
</div>

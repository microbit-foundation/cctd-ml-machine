<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<style>
  .normal {
    padding: 12px 40px;
    font-size: 16px;
  }
  .small {
    padding: 1px 10px;
    font-size: 14px;
  }
  .outlined {
    color: var(--color);
    border-style: solid;
    border-color: var(--color);
    border-width: var(--border-width);
  }
  .filled {
    background-color: var(--color);
    border-width: var(--border-width);
    border-color: transparent;
    opacity: 1;
    color: white;
  }
  .fillOnHover:hover {
    background-color: var(--color);
    opacity: 1;
    color: white;
    transition-duration: 300ms;
  }
</style>

<script lang="ts">
  import TypingUtils from '../../lib/TypingUtils.js';
  import windi from './../../../windi.config.js';
  import Tooltip from '../base/Tooltip.svelte';
  import { fade } from 'svelte/transition';

  type variants =
    | 'secondary'
    | 'primary'
    | 'warning'
    | 'info'
    | 'infolight'
    | 'disabled'
    | string;

  export let color: variants = 'secondary';
  export let onClick: (e: Event) => void = TypingUtils.emptyFunction;
  export let disabled = false;
  export let small = false;
  export let outlined = false;
  export let fillOnHover = false;
  export let bold = true;
  export let shadows = true;
  export let disabledTooltip: string | undefined = undefined;

  const bgColors: { [key in variants]: string } = {
    primary: windi.theme.extend.colors.primary,
    secondary: windi.theme.extend.colors.secondary,
    warning: windi.theme.extend.colors.warning,
    info: windi.theme.extend.colors.info,
    infolight: windi.theme.extend.colors.infolight,
    disabled: windi.theme.extend.colors.disabled,
  };
  const isKey = Object.keys(bgColors).includes(color);
  const colorParam = isKey ? bgColors[disabled ? 'disabled' : color] : color;
  let hoverTimeout: NodeJS.Timeout | undefined;

  let isDropdownOpen = false;
  const handleHoverEnter = () => {
    isDropdownOpen = true;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
  };
  const handleHoverExit = () => {
    hoverTimeout = setTimeout(() => {
      isDropdownOpen = false;
    }, 200);
  };
</script>

<div class="relative">
  {#if disabled}
    <Tooltip title={disabledTooltip}>
      <button
        {disabled}
        style="--border-width: {bold ? '2px' : '1px'}"
        class="outline-none rounded-full"
        class:shadow-md={shadows}
        class:bg-disabled={true}
        class:font-bold={bold}
        class:small
        class:normal={!small}
        class:outlined
        class:cursor-default={disabled}
        on:click={onClick}>
        <div class="flex flex-row justify-between justify-center items-center">
          <slot />
        </div>
      </button>
    </Tooltip>
  {:else}
    <button
      style="--color: {colorParam}
    ; --border-width: {bold ? '2px' : '1px'}"
      class="outline-none rounded-full"
      class:shadow-md={shadows}
      class:font-bold={bold}
      class:small
      class:normal={!small}
      class:outlined
      class:filled={!outlined}
      class:fillOnHover
      class:cursor-pointer={!disabled}
      on:mouseenter={handleHoverEnter}
      on:mouseleave={handleHoverExit}
      on:click={onClick}>
      <div class="flex flex-row justify-between justify-center items-center">
        <slot />
        <div class="flex flex-col justify-center pl-2">
          <i class="fa fa-chevron-down pt-0.25" />
        </div>
      </div>
    </button>
  {/if}
  {#if isDropdownOpen}
    <div
      on:mouseenter={handleHoverEnter}
      on:mouseleave={handleHoverExit}
      transition:fade={{ duration: 100 }}
      style="--color: {colorParam}; background-color: var(--color)"
      class="absolute top-7 right-1 p-1 px-2 text-secondarytext text-xs rounded-md shadow-md">
      <slot name="content" />
    </div>
  {/if}
</div>

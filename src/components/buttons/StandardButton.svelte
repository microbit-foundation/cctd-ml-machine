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
  .filled:hover {
    opacity: 85%;
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
  export let icon: string | undefined = undefined;
  export let colorOverride: string | undefined = undefined;

  const bgColors: { [key in variants]: string } = {
    primary: windi.theme.extend.colors.primary,
    secondary: windi.theme.extend.colors.secondary,
    warning: windi.theme.extend.colors.warning,
    info: windi.theme.extend.colors.info,
    infolight: windi.theme.extend.colors.infolight,
    disabled: windi.theme.extend.colors.disabled,
  };
  const isKey = Object.keys(bgColors).includes(color);
  let colorParam = isKey ? bgColors[disabled ? 'disabled' : color] : color;
  if (colorOverride) {
    colorParam = colorOverride;
  }
</script>

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
        {#if icon}
          <img alt="" class="max-h-6 ml-2 -mr-3" src={icon} />
        {/if}
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
    on:click={onClick}>
    <div class="flex flex-row justify-between justify-center items-center">
      <slot />
      {#if icon}
        <img alt="" class="max-h-6 ml-2 -mr-3" src={icon} />
      {/if}
    </div>
  </button>
{/if}

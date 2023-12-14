<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<style>
  .normal {
    padding: 12px 40px;
  }
  .small {
    padding: 1px 10px;
  }
  .outlined {
    color: var(--color);
    border-style: solid;
    border-color: var(--color);
    border-width: var(--border-width);
  }
  .filled {
    background-color: var(--color);
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
  import TypingUtils from '../script/TypingUtils';
  import windi from './../../windi.config.js';

  type variants = 'secondary' | 'primary' | 'warning' | 'info' | 'infolight' | 'disabled';

  export let color: variants = 'secondary';
  export let onClick: (e: Event) => void = TypingUtils.emptyFunction;
  export let disabled = false;
  export let small = false;
  export let outlined = false;
  export let fillOnHover = false;
  export let bold = true;
  export let shadows = true;

  const bgColors: { [key in variants]: string } = {
    primary: windi.theme.extend.colors.primary,
    secondary: windi.theme.extend.colors.secondary,
    warning: windi.theme.extend.colors.warning,
    info: windi.theme.extend.colors.info,
    infolight: windi.theme.extend.colors.infolight,
    disabled: windi.theme.extend.colors.disabled,
  };
</script>

<div class="grid grid-cols-1 content-center place-items-center">
  <button
    {disabled}
    style="--color: {bgColors[disabled ? 'disabled' : color]}
    ; --border-width: {bold ? '2px' : '1px'}"
    class="outline-none rounded-full"
    class:shadow-md={shadows}
    class:font-bold={bold}
    class:small
    class:normal={!small}
    class:outlined
    class:filled={!outlined}
    class:fillOnHover={fillOnHover && !disabled}
    class:cursor-pointer={!disabled}
    class:cursor-default={disabled}
    on:click={onClick}>
    <slot />
  </button>
</div>

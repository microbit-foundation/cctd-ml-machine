<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<style>
  .contTextNormal {
    padding: 12px 36px 12px 40px;
  }
  .contTextSmall {
    padding: 1px 1px 1px 1px;
  }
  .contIconNormal {
    padding: 12px 20px 12px 12px;
  }
  .contIconSmall {
    padding: 1px 1px 1px 1px;
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
  .hoverable:hover {
    filter: brightness(95%);
    transition-duration: 300ms;
  }
</style>

<script lang="ts">
  import windi from './../../../windi.config.js';
  import TypingUtils from '../../script/TypingUtils';
  import { type DropdownOption } from './Buttons';
  type variants = 'secondary' | 'primary' | 'warning' | 'info' | 'infolight' | 'disabled';

  export let options: DropdownOption[];
  export let defaultOptionSelected: DropdownOption | undefined = undefined;
  export let buttonText: string | undefined = undefined;

  export let color: variants = 'secondary';
  export let onClick: (e: Event) => void = TypingUtils.emptyFunction;
  export let onSelect: (option: DropdownOption) => void = TypingUtils.emptyFunction;
  export let disabled = false;
  export let small = false;
  export let outlined = false;
  export let bold = true;
  export let shadows = true;

  let isDropdownOpen = false;

  if (!options || options.length == 0) {
    throw new Error('Cannot create dropdown button without options!');
  }

  let selectedOption = defaultOptionSelected ? defaultOptionSelected : options[0];

  const bgColors: { [key in variants]: string } = {
    primary: windi.theme.extend.colors.primary,
    secondary: windi.theme.extend.colors.secondary,
    warning: windi.theme.extend.colors.warning,
    info: windi.theme.extend.colors.info,
    infolight: windi.theme.extend.colors.infolight,
    disabled: windi.theme.extend.colors.disabled,
  };

  const toggleDropDown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const optionClickHandler = (option: DropdownOption) => {
    if (isDropdownOpen) {
      toggleDropDown();
    }
    selectedOption = option;
    onSelect(selectedOption);
  };

  const dropDownButtonClickHandler = () => {
    if (disabled) {
      isDropdownOpen = false;
      return;
    }
    toggleDropDown();
  };
</script>

<div class="flex flex-row justify-center place-items-center">
  <div class="relative flex">
    <button
      {disabled}
      style="--color: {bgColors[disabled ? 'disabled' : color]}
  ; --border-width: {bold ? '2px' : '1px'}"
      class="rounded-l-full"
      class:shadow-md={shadows}
      class:font-bold={bold}
      class:outlined
      class:filled={!outlined}
      class:hoverable={!disabled}
      class:cursor-pointer={!disabled}
      class:cursor-default={disabled}
      on:click={onClick}>
      <div class="flex flex-row justify-center items-center">
        <div class:contTextSmall={small} class:contTextNormal={!small}>
          {buttonText ? buttonText : selectedOption.label}
        </div>
      </div>
    </button>
    <button
      class:contIconSmall={small}
      class:contIconNormal={!small}
      style="--color: {bgColors[disabled ? 'disabled' : color]}
      ; --border-width: {bold ? '2px' : '1px'}"
      class:font-bold={bold}
      class:shadow-md={shadows}
      class:outlined
      class:filled={!outlined}
      class:hoverable={!disabled}
      class:cursor-pointer={!disabled}
      class:cursor-default={disabled}
      on:click={dropDownButtonClickHandler}
      class="relative rounded-r-full h-full">
      <i class="fas fa-solid fa-chevron-down" />
      <div
        style="--color: {bgColors[disabled ? 'disabled' : color]}
      ; --border-width: {bold ? '2px' : '1px'}"
        class:outlined
        class:hidden={outlined}
        class:filled={!outlined}
        class="absolute h-full w-2 bottom-0 -left-1" />
    </button>
    <div
      class:opacity-0={!isDropdownOpen}
      class:opacity-100={isDropdownOpen}
      style="--color: {bgColors[disabled ? 'disabled' : color]}"
      class="absolute duration-90 outlined transition-hidden right-2 top-12 rounded-md">
      {#each options as option, index}
        <p
          on:click={() => {
            if (!isDropdownOpen) return;
            optionClickHandler(option);
          }}
          style="--color: {bgColors[disabled ? 'disabled' : color]}"
          class:rounded-t={index === 0}
          class:rounded-b={index === options.length - 1}
          class:bg-backgroundlight={outlined}
          class:cursor-pointer={isDropdownOpen}
          class:filled={!outlined}
          class="p-2 hoverable select-none">
          {option.label}
        </p>
      {/each}
    </div>
  </div>
</div>

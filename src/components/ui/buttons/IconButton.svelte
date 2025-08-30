<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors

  SPDX-License-Identifier: MIT
-->

<style>
  .icon-button {
    background: transparent;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon-button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .icon-button--small {
    font-size: 1rem;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let small: boolean = false;
  export let title: string = '';
  export let ariaLabel: string = '';
  export let disabled: boolean = false;
  export let className: string = '';

  const dispatch = createEventDispatcher();

  function handleClick(e: MouseEvent) {
    if (disabled) return;
    dispatch('click', e);
  }
</script>

<button
  class={'icon-button text-light-800 hover:text-black transition ease ' +
    (small ? 'icon-button--small ' : '') +
    className}
  on:click|stopPropagation={handleClick}
  {title}
  aria-label={ariaLabel}
  {disabled}>
  <slot />
</button>

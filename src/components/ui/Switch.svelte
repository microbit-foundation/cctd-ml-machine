<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let label: string = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  const dispatch = createEventDispatcher();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    dispatch('change', { checked });
  }

  // Size classes
  const sizeMap = {
    sm: { btn: 'w-8 h-5', knob: 'w-4 h-4', translate: '0.9rem' },
    md: { btn: 'w-12 h-7', knob: 'w-6 h-6', translate: '1.25rem' },
    lg: { btn: 'w-16 h-9', knob: 'w-8 h-8', translate: '1.75rem' },
  };
  $: btnSize = sizeMap[size]?.btn || sizeMap.md.btn;
  $: knobSize = sizeMap[size]?.knob || sizeMap.md.knob;
  $: knobTranslate = sizeMap[size]?.translate || sizeMap.md.translate;
</script>

<div class="flex items-center space-x-3 select-none">
  {#if label}
    <label class="text-base cursor-pointer" on:click={toggle}>{label}</label>
  {/if}
  <button
    type="button"
    class="relative focus:outline-none transition-colors duration-200 rounded-full border-2 border-gray-300 bg-gray-200 flex items-center {btnSize} {disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer'}"
    aria-checked={checked}
    on:click|stopPropagation
    aria-label={label}
    {disabled}
    on:click={toggle}
    role="switch"
    tabindex="0">
    <span
      class="absolute left-0 top-0 w-full h-full rounded-full transition-colors duration-200"
      class:bg-primary={checked && !disabled}
      class:bg-gray-200={!checked || disabled}
      class:border-primary={checked && !disabled}
      class:border-gray-300={!checked || disabled}></span>
    <span
      class="inline-block bg-white rounded-full shadow transform transition-transform duration-200 z-10 border border-gray-300 {knobSize}"
      style="transform: translateX({checked ? knobTranslate : '0rem'});"></span>
  </button>
</div>

<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let defaultValue: number;
  export let onChange: (val: number) => void;

  const increase = () => {
    value = parseInt(value + '') + 1;
    handleChange();
  };

  const decrease = () => {
    value = parseInt(value + '') - 1;
    handleChange();
  };
  let value: string | number = defaultValue;

  const clamp = () => {
    if (min !== undefined) {
      if (parseInt(value + '') < min) {
        return min;
      }
    }
    if (max !== undefined) {
      if (parseInt(value + '') > max) {
        return max;
      }
    }
    return value;
  };

  const handleChange = () => {
    value = clamp();
    onChange(parseInt(value + ''));
  };
</script>

<div class="flex flex-row">
  <span
    class="border-solid border-1 border-r-0 bg-primary rounded-l-md
  px-1 font-bold select-none cursor-pointer border-primaryborder
  hover:opacity-100 opacity-75"
    on:click={decrease}>
    -
  </span>
  <input
    bind:value
    on:blur={() => {
      handleChange();
    }}
    class="max-w-20 text-center border-solid border-1 px-2 bg-primary border-primaryborder" />
  <span
    class="border-solid border-1 border-l-0 bg-primary rounded-r-md
    px-1 font-bold select-none cursor-pointer border-primaryborder
    hover:opacity-100 opacity-75"
    on:click={increase}>
    +
  </span>
</div>

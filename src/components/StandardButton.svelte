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
  import windi from './../../windi.config.js';
  type variants = 'secondary' | 'primary' | 'warning' | 'info' | 'infolight' | 'disabled';
  export let color: variants = 'secondary';
  export let onClick: () => void = () => {
    return;
  };
  export let disabled = false;
  export let stopPropagation = false;
  export let small = false;
  export let outlined = false;
  export let fillOnHover = false;
  export let isFileInput = false;
  export let bold = true;
  export let shadows = true;

  const bgColors: { [key: variants]: string } = {
    primary: windi.theme.extend.colors.primary,
    secondary: windi.theme.extend.colors.secondary,
    warning: windi.theme.extend.colors.warning,
    info: windi.theme.extend.colors.info,
    infolight: windi.theme.extend.colors.infolight,
    disabled: windi.theme.extend.colors.disabled,
  };
  let fileInputElement: HTMLInputElement;
  const handleFileInput = () => {
    fileInputElement.click();
    fileInputElement.onchange = onClick;
  };
</script>

<div class="grid grid-cols-1 content-center place-items-center">
  {#if isFileInput}
    <input class="hidden" bind:this={fileInputElement} type="file" />
  {/if}
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
    on:click={e => {
      if (stopPropagation) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        e.stopPropagation();
      }
      if (isFileInput) {
        handleFileInput();
      } else {
        onClick();
      }
    }}>
    <slot />
  </button>
</div>

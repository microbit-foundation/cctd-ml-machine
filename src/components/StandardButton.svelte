<script lang="ts">
  import windi from "./../../windi.config.js"
  type variants = "secondary" | "primary" | "warning" | "info" | "infolight" | "disabled"
  export let color: variants = "secondary"
  export let onClick: () => void = () => {return}
  export let stopPropagation = false
  export let small = false
  export let outlined = false
  export let fillOnHover = false

  const bgColors: {[key: variants]: string} = {
    "primary": windi.theme.extend.colors.primary,
    "secondary": windi.theme.extend.colors.secondary,
    "warning": windi.theme.extend.colors.warning,
    "info": windi.theme.extend.colors.info,
    "infolight": windi.theme.extend.colors.infolight,
    "disabled": windi.theme.extend.colors.disabled
  }

</script>

<div class="grid grid-cols-1 content-center place-items-center">
  <button
    style="--color: {bgColors[color]};"
    class="outline-none
           font-bold rounded-full
           shadow-gray-600 shadow-md"
    class:small={small}
    class:normal={!small}
    class:outlined={outlined}
    class:filled={!outlined}
    class:fillOnHover={fillOnHover}
    on:click={(e) => {
      if (stopPropagation){
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        e.stopPropagation()
      }
      onClick()
    }}
  >
    <slot></slot>
  </button>
</div>

<style>
  .normal {
    padding: 12px 40px;
  }
  .small {
    padding: 4px 14px;
  }
  .outlined {
    color: var(--color);
    border-style: solid;
    border-color: var(--color);
    border-width: 2px;
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


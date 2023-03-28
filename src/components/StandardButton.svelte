<script lang="ts">

  export let color: "red" | "blue" | "gray" | "pink" = "blue"
  export let onClick: () => void = () => {return}
  export let stopPropagation = false
  export let small = false
  export let outlined = false
  export let fillOnHover = false

  const bgColors: {[key: string]: string} = {
    "blue": "#63BFC2",
    "red": "#FF7777",
    "gray": "gray",
    "pink": "#EDBFD9"
  }

</script>

<div class="grid grid-cols-1 content-center place-items-center">
  <button
    style="--color: {bgColors[color]};"
    class="
      outline-none
      font-bold rounded-full
      shadow-gray-400 shadow-lg"
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


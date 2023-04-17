<script lang="ts">
  import { fade } from 'svelte/transition';

  export let expanded = false;
</script>

<main class="fixed h-12 flex w-full items-center bg-[#63BFC2]">
  <div class="w-10">
    <i
      aria-hidden="true"
      class="{expanded ? 'fa fa-times' : 'fa fa-bars'} ml-4 cursor-pointer"
      on:click="{() => (expanded = !expanded)}"
      transition:fade></i>
  </div>
  {#if expanded}
    <main class="flex items-center" transition:fade>
      <slot />
    </main>
  {/if}
</main>

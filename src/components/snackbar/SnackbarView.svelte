<!--
  (c) 2023, center for computational thinking and design at aarhus university and contributors
 
  spdx-license-identifier: mit
 -->
<script lang="ts">
  import { slide } from 'svelte/transition';
  import { stores } from '../../script/stores/Stores';
  const snackbar = stores.getSnackbar();
  $: isOpen = $snackbar !== undefined;
  $: snackbarText = $snackbar;
</script>

{#if isOpen}
  <div
    class="shadow-md absolute max-w-80 bottom-0 right-0 m-4 z-100 rounded bg-primary"
    transition:slide>
    <div class="p-3 flex flex-row align-center">
      <p class="text-sm text-secondarytext mr-3">{snackbarText}</p>
      <i
        class="far fa-times-circle text-secondarytext cursor-pointer self-center"
        on:click={() => snackbar.clearMessaage()} />
    </div>
  </div>
{/if}

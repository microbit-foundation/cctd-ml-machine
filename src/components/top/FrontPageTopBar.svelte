<script lang="ts">
  import { t, locale, locales } from "../../i18n";
  import StandardDialog from "../dialogs/StandardDialog.svelte"
  
  let isContactDialogOpen = false

</script>

<main class="pt-5 pb-3 h-15 w-full">
  <StandardDialog
    isOpen={isContactDialogOpen}
    onClose={() => isContactDialogOpen = false}
    >
      <p class="w-60">
        {$t("content.index.contactBody")}
        <a 
          href={`mailto:${$t("content.index.contactMail")}`}
          class="underline text-red-500 hover:text-red-300 "
          >
            {$t("content.index.contactMail")}
        </a>
      </p>
  </StandardDialog>

  <select class="bg-[#63BFC2] outline-none float-right text-white ml-2 mr-2 pl-2 pr-2" bind:value={$locale}>
    {#each locales as l}
        <option value={l}>{l}</option>
    {/each}
  </select>
  <button
  on:click={() => isContactDialogOpen = !isContactDialogOpen}
    class="border outline-none border-solid rounded-full ml-2 mr-2 pl-4 pr-4 float-right text-white pl-2 pr-2">
      {$t("content.index.contactButton")}
  </button>
  <div class="h-full ml-10 flex items-center">
    <p class="text-white text-xs">{$t("content.index.acknowledgement")}</p>
  </div>
</main>


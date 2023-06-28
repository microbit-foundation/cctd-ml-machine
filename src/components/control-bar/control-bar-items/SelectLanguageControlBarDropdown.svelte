<script>
  import { locale, locales } from '../../../i18n';
</script>

<select class="outline-none text-primarytext ml-2 mr-2 pl-2 pr-2" bind:value={$locale}>
  {#each locales as l}
    <option value={l}>{l}</option>
  {/each}
</select>

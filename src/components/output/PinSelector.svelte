<script lang="ts">
  import { each, onMount } from 'svelte/internal';
  import GestureTilePart from './../GestureTilePart.svelte';
  import { t } from '../../i18n';
  export let onPinSelect: (pin: number) => void;

  let selectedPin: number = 0;
  const maxPin = 9;

  const onPinSelected = () => {
    onPinSelect(selectedPin);
  };

  onMount(() => {
    onPinSelected();
  });
</script>

<GestureTilePart>
  <div class="p-4 h-full w-40 flex flex-col justify-between py-8">
    <p class="text-center">{$t('content.model.output.pin.selectPin')}</p>
    <select
      class="bg-white border rounded text-center"
      bind:value={selectedPin}
      on:change={onPinSelected}
      on:click={e => {
        e.stopPropagation();
      }}>
      {#each { length: maxPin + 1 } as _, i}
        <option value={i}>{i}</option>
      {/each}
    </select>
  </div>
</GestureTilePart>

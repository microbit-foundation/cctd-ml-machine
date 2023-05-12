<script lang="ts">
  import { each, onMount } from 'svelte/internal';
  import GestureTilePart from './../GestureTilePart.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  export let onPinSelect: (pin: number) => void;

  enum PinTurnOnState {
    ALL_TIME,
    X_TIME,
  }

  let turnOnState = PinTurnOnState.ALL_TIME;

  let selectedPin = StaticConfiguration.defaultOutputPin;

  const onPinSelected = () => {
    onPinSelect(selectedPin);
  };

  onMount(() => {
    onPinSelected();
  });

  const pins = [
    '3',
    '0',
    '4',
    '5',
    '6',
    '7',
    '1',
    '8',
    '9',
    '10',
    '11',
    '12',
    '2',
    '13',
    '14',
    '15',
    '16',
    '17',
    '3V',
    '19',
    '20',
    '21',
    '22',
    'GND',
    '24',
  ];
</script>

<GestureTilePart>
  <div class="flex flex-row">
    {#each pins as val, index}
      {#if ['0', '1', '2', '3V', 'GND'].includes(val)}
        <div
          class="bg-yellow-400 h-8 w-7 rounded-bl-xl ml-1px rounded-br-xl hover:bg-yellow-300">
          <p class="text-center text-xs">{val}</p>
        </div>
      {:else}
        <div
          class="bg-yellow-400 h-7 w-2 rounded-bl-xl ml-1px rounded-br-xl hover:bg-yellow-300" />
      {/if}
    {/each}
  </div>

  <div class="flex flex-col">
    <select
      class="bg-white border rounded text-center"
      bind:value={selectedPin}
      on:change={onPinSelected}
      on:click|stopPropagation>
      <option value={PinTurnOnState.ALL_TIME}><p>Tændt hele tiden</p></option>
      <option value={PinTurnOnState.X_TIME}><p>X mængde tid</p></option>
    </select>
  </div>
</GestureTilePart>

<!--
<div class="p-4 h-full w-40 flex flex-col justify-between py-8">
    <p class="text-center">{$t('content.model.output.pin.selectPin')}</p>
    <select
      class="bg-white border rounded text-center"
      bind:value={selectedPin}
      on:change={onPinSelected}
      on:click|stopPropagation>
      {#each { length: StaticConfiguration.numberOfAvailablePins } as _, i}
        <option value={i}>{i}</option>
      {/each}
    </select>
  </div>

-->

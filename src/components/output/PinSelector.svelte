<script lang="ts">
  import GestureTilePart from './../GestureTilePart.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import { PinTurnOnState } from './PinSelectorUtil';
  export let onPinSelect: (pin: string) => void;
  export let onTurnOnTimeSelect: ({
    turnOnState: PinTurnOnState,
    turnOnTime: number,
  }) => void;

  export let turnOnTime: number;
  export let turnOnState: PinTurnOnState;
  export let selectedPin: number;

  let selectedTurnOnState = turnOnState;
  let turnOnTimeInSeconds = turnOnTime / 1000;

  const onPinSelected = (pin: string) => {
    onPinSelect(pin);
  };

  const onTurnOnStateSelect = () => {
    onTurnOnTimeSelect({
      turnOnState: selectedTurnOnState,
      turnOnTime: turnOnTimeInSeconds * 1000,
    });
  };

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
    '18',
    '19',
    '20',
    '21',
    'GND',
    '24',
  ];

  const largePins = ['0', '1', '2', '3V', 'GND'];
</script>

<GestureTilePart>
  <div class="flex flex-row">
    {#each pins as val, index}
      {#if StaticConfiguration.supportedPins.includes(val)}
        <!-- This are pins we support, make them selectable and yellow -->
        {#if largePins.includes(val)}
          <!-- Large pins -->
          <div
            on:click={() => {
              onPinSelected(val);
            }}
            class="bg-yellow-400 h-8 w-7 rounded-bl-xl ml-1px rounded-br-xl hover:bg-yellow-300"
            class:bg-yellow-600={selectedPin === val}>
            <p class="text-center text-xs">{val}</p>
          </div>
        {:else}
          <!-- Small pins -->
          <div
            on:click={() => {
              onPinSelected(val);
            }}
            class:bg-yellow-600={selectedPin === val}
            class="bg-yellow-400 h-7 w-1 rounded-bl-xl ml-1px rounded-br-xl hover:bg-yellow-300" />
        {/if}
      {:else}
        <!-- This are pins we DO NOT support, make them non-selectable and gray -->
        {#if largePins.includes(val)}
          <!-- Large pins -->
          <div class="bg-amber-200 opacity-50 h-8 w-7 rounded-bl-xl ml-1px rounded-br-xl">
            <p class="text-center text-xs">{val}</p>
          </div>
        {:else}
          <!-- Small pins -->
          <div
            class="bg-amber-200 opacity-50 h-7 w-1 rounded-bl-xl ml-1px rounded-br-xl" />
        {/if}
      {/if}
    {/each}
  </div>

  <div class="flex flex-col justify-center items-center">
    <div class="w-40">
      <select
        class="bg-white border mt-4 mb-2 rounded text-center"
        bind:value={selectedTurnOnState}
        on:change={onTurnOnStateSelect}
        on:click|stopPropagation>
        <option value={PinTurnOnState.ALL_TIME}><p>Tændt hele tiden</p></option>
        <option value={PinTurnOnState.X_TIME}><p>Tænd i X sekunder</p></option>
      </select>
      {#if turnOnState === PinTurnOnState.X_TIME}
        <div class="flex flex-row justify-center">
          <p class="mr-2">Sekunder</p>
          <input
            type="number"
            on:change={onTurnOnStateSelect}
            class="w-12 border-1 border-primaryborder"
            bind:value={turnOnTimeInSeconds} />
        </div>
      {/if}
    </div>
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

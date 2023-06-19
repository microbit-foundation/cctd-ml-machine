<script lang="ts">
  import GestureTilePart from './../GestureTilePart.svelte';
  import StaticConfiguration from '../../StaticConfiguration';
  import { PinTurnOnState } from './PinSelectorUtil';
  import { t } from '../../i18n.js';
  import MBSpecs from '../../script/microbit-interfacing/MBSpecs.js';
  export let onPinSelect: (pin: MBSpecs.UsableIOPin) => void;
  export let onTurnOnTimeSelect: ({
    turnOnState: PinTurnOnState,
    turnOnTime: number,
  }) => void;

  export let turnOnTime: number;
  export let turnOnState: PinTurnOnState;
  export let selectedPin: string;

  let selectedTurnOnState = turnOnState;
  let turnOnTimeInSeconds = turnOnTime / 1000;

  const onPinSelected = (pin: MBSpecs.UsableIOPin) => {
    onPinSelect(pin);
  };

  const onTurnOnStateSelect = () => {
    onTurnOnTimeSelect({
      turnOnState: selectedTurnOnState,
      turnOnTime: turnOnTimeInSeconds * 1000,
    });
  };

  const largePins: MBSpecs.IOPin[] = [0, 1, 2, '3V', 'GND'];
</script>

<GestureTilePart>
  <div class="flex flex-row">
    {#each MBSpecs.IO_PIN_LAYOUT as val, index}
      {#if StaticConfiguration.supportedPins.includes(val)}
        <!-- These are pins we support, make them selectable and yellow -->
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
    <div class="flex flex-row w-full mt-2 justify-around">
      <div class="flex flex-col">
        <input
          type="radio"
          bind:group={selectedTurnOnState}
          on:change={onTurnOnStateSelect}
          on:click|stopPropagation
          value={PinTurnOnState.ALL_TIME} />
        <p>{$t('content.model.output.pin.option.allTime')}</p>
      </div>
      <div class="flex flex-col">
        <input
          type="radio"
          bind:group={selectedTurnOnState}
          on:change={onTurnOnStateSelect}
          on:click|stopPropagation
          value={PinTurnOnState.X_TIME} />
        <p>{$t('content.model.output.pin.option.xTime')}</p>
      </div>
    </div>
    <div class="w-40 mt-4">
      {#if turnOnState === PinTurnOnState.X_TIME}
        <div class="flex flex-row justify-center">
          <p class="mr-2">{$t('content.model.output.pin.seconds')}</p>
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

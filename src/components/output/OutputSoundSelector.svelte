<script lang="ts">
  import { onMount } from "svelte";
  import {t} from "../../i18n"

  export let onSoundSelection: (sound: {name: string, path: string, id: string} | undefined) => void
  export let selectedSound: {name: string, id: string, path: string} | undefined = undefined

  let hasEnabledSound = false
  
  const soundArray = [
    {name: $t("content.model.output.soundOptionCongratulations"), id: "0", path: "sounds/congratulations.wav"},
    {name: $t("content.model.output.soundOptionHighPitchBeep"), id: "1", path: "sounds/high_pitch.wav"},
    {name: $t("content.model.output.soundOptionLowPitchBeep"), id: "2", path: "sounds/low_pitch.wav"},
    {name: $t("content.model.output.soundOptionLoser"), id: "3", path: "sounds/looser.wav"},
    {name: $t("content.model.output.soundOptionMistake"), id: "4", path: "sounds/mistake.mp3"},
    {name: $t("content.model.output.soundOptionHugeMistake"), id: "5", path: "sounds/huge_mistake.wav"},
  ];
  
  function onToggleSound(): void {
    hasEnabledSound = !hasEnabledSound
    if (hasEnabledSound){
      if (selectedSound === undefined){
        selectedSound = soundArray[0]
      }
      onSoundSelection(selectedSound)
    } else {
      onSoundSelection(undefined)
    }
  }

  onMount(() => {
    // check if a sound has been saved (and therefore passed as a property)
    hasEnabledSound = selectedSound !== undefined
    if (!hasEnabledSound){
      return
    }
    // TODO: Rethink this. Not very elegant
    // If a sound is saved, match it up with the possible options, to make it display properly in the html
    for (let i = 0; i < soundArray.length; i++){
      if (selectedSound !== undefined && selectedSound.id === soundArray[i].id){
        selectedSound = soundArray[i]
        return
      }
    }
    // If no match was found, disable sound
    selectedSound = soundArray[0]
    hasEnabledSound = false
    onSoundSelection(undefined)
  })

</script>


<main class="h-146px w-146px ml-8 self-center items-center border-1
             border-solid border-primaryborder bg-white rounded-lg cursor-pointer relative"
      on:click={onToggleSound}>
  <i class="absolute text-center top-42px left-38px fa fa-volume-up text-6xl  text-[#63BFC2]" />
  {#if !hasEnabledSound}
    <i class="absolute top-42px left-38px fas fa-slash text-6xl text-[#63BFC2]" />
  {/if}

  {#if hasEnabledSound}
  <select class="bg-white border rounded text-center absolute bottom-2 ml-13px mr-13px w-120px"
          bind:value={selectedSound}
          on:change={() => onSoundSelection(selectedSound)}
          on:click={(e) => {
            e.stopPropagation()
          }}
          disabled={!hasEnabledSound}>
    {#each soundArray as option}
      <option value={option}>{option.name}</option>
    {/each}
  </select>
  {/if}
</main>

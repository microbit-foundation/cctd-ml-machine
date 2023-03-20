<script lang="ts">
    // IMPORT AND DEFAULTS
    import OutputMatrix from "./output/OutputMatrix.svelte";
    import {
        settings, 
        gestureConfidences, 
        updateGestureSoundOutput, 
        type GestureData, 
        type SoundData 
    } from "../script/stores/mlStore";
    import {t} from "../i18n"
    import TextInformation from "./information/TextInformation.svelte";
    import OutputSoundSelector from "./output/OutputSoundSelector.svelte";
    import Microbits from "../script/microbit-interfacing/Microbits";
    import ImageSkeleton from "./skeletonloading/ImageSkeleton.svelte";


    // Variables for component
    export let gesture: GestureData;
    export let onUserInteraction: () => void = () => {return}
    let triggered = false;
    let triggerFunctions: (() => void)[] = [];
    let selectedSound: SoundData | undefined = gesture.output.sound

    let requiredConfidenceLevel = 80;
    // $: gesture.output.sound = selectedSound

    // $: if (shouldTrigger(requiredConfidenceLevel, confidenceLevel, triggered)) triggerComponnets();
    $: if (shouldTrigger(requiredConfidenceLevel, $gestureConfidences[gesture.ID], triggered)) {
        triggerComponnets()
        playSound()
    }

    function onSoundSelected(sound: SoundData | undefined): void {
        selectedSound = sound
        updateGestureSoundOutput(gesture.ID, sound)
        onUserInteraction()
    }

    function playSound(){
        if (selectedSound === undefined){
            return
        }
        if (!Microbits.isOutputAssigned()) {
            return;
        }
        if (Microbits.getAssignedOutput().getVersion() === 1) {
            const sound = new Audio(selectedSound.path);
            void sound.play();
        } else {
            void Microbits.sendToOutputUart("s", selectedSound.id);
        }
    }

    function shouldTrigger(requiredConfidence: number, confidence: number, oldTriggered: boolean) {
        triggered = requiredConfidence <= confidence * 100;
        if (!triggered) return false;
        if (!$settings.automaticClassification) return true;
        if (oldTriggered) return false;
        return true;
    }

    const triggerComponnets = () => 
        triggerFunctions.forEach(triggerFunc => {triggerFunc()});

    let hasLoadedMicrobitImage = false;

</script>

<main class=" pl-3 mb-4 justify-center items-center layout-grid">
    <!-- NAMES AND CONFIDENCE METER -->
    <div class="h-146px heavy-shadow self-center
                items-center flex border border-solid
                border-gray-200 p-2 bg-white rounded-xl">
        <div class="w-36 text-center font-semibold rounded-xl
                    px-1 py-1 border border-gray-300
                    border-solid mr-2 break-words">
            <h3>{gesture.name}</h3>
        </div>

        <input class="h-25 rotate-90"
                type="range"
                orient="vertical"
                name=""
                min="10"
                max="90"
                id=""
                bind:value={requiredConfidenceLevel} />

        <!-- METER -->
        <div class="w-4 h-25 relative">
            <div class="w-4 h-full absolute rounded border border-solid border-gray-400 overflow-hidden">
                <div class="absolute w-5 {triggered ? 'bg-blue-500' : 'bg-gray-400'} z-index: -10"
                     style="height: {100 * $gestureConfidences[gesture.ID]}px; margin-top: {100 -
            100 * $gestureConfidences[gesture.ID]}px;" />
                <div class="absolute w-5 bg-blue-500"
                        style="height: 1px; margin-top: {6.5 -
            0.068 * requiredConfidenceLevel}rem;" />
                <div class="absolute">
                    {#each [75, 50, 25] as line}
                        <div class="w-5 bg-gray-300 mt-6" style="height: 1px;">
                            <p class="absolute text-xs" style="margin-top: -8px; margin-left: 18px;" >
                                {line}%
                            </p>
                        </div>
                    {/each}
                </div>
                <div/>
            </div>
        </div>
        <div class="relative float-right h-full mt-2" style="top:-12px">
            <TextInformation
                titleText={$t("content.model.classification.helpHeading")}
                bodyText={$t("content.model.classification.helpBody")}
                isLightTheme={false} />
        </div>
    </div>
        
    <!-- ARROW -->
    <div class="text-center ml-auto mr-auto" class:invert={triggered}>
        <img class="m-auto "
            src={triggered ? "imgs/right_arrow_blue.svg" : "imgs/right_arrow.svg"}
            alt="right arrow icon"
            width="30px"/>
    </div>

    <!-- OUTPUT SETTINGS -->
    <div class="relative flex items-center">
        <div class=" w-180px relative rounded-xl bg-transparent heavy-shadow h-full">
            <ImageSkeleton src="imgs/blank_microbit.svg"
                           alt="microbit guide"
                           width={180}
                           height={146}
                           loadingColorSecondary="#818181"
                           loadingColorPrimary="#4A4A4A"
                           onLoaded={() => hasLoadedMicrobitImage = true}/>
                <div class="bg-black p-0 m-0 absolute top-10 left-13.5 w-18 h-18"
                     class:hidden={!hasLoadedMicrobitImage}
                     on:click={onUserInteraction}>
                    <OutputMatrix 
                        bind:trigger={triggerFunctions[0]} 
                        gesture={gesture}
                    />
                </div>
        </div>
        <OutputSoundSelector 
            onSoundSelection={onSoundSelected}
            selectedSound={selectedSound}
        />

    </div>
</main>

<style>
    .layout-grid {
        display: grid;
        grid-template-columns: 13rem 3rem 1fr;
    }

    input[type="range"][orient="vertical"] {
        writing-mode: bt-lr; /* IE */
        -webkit-appearance: slider-vertical; /* WebKit */
        width: 20px;
    }

    .heavy-shadow {
		/* filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.459)); */
        box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.2);
	}
</style>

<script lang="ts">
    import {state} from "../../script/stores/uiStore";
    import LiveGraph from "../graphs/LiveGraph.svelte";
    import {fade} from "svelte/transition";
    import {t} from "../../i18n";
    import MainConnectDialog from "../connection-prompt/ConnectDialogContainer.svelte";
    import TextInformation from "../information/TextInformation.svelte";
    import Microbits from "../../script/microbit-interfacing/Microbits";
    import StandardButton from "../StandardButton.svelte";
    import TypingUtils from "../../script/TypingUtils";

    let componentWidth: number;
    let connectDialogReference: MainConnectDialog;

    const connectButtonClicked = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        connectDialogReference.startConnectionProcess();
    };

    const inputDisconnectButtonClicked = () => {
        Microbits.expelInputAndOutput();
    };

    const outputDisconnectButtonClicked = () => {
        Microbits.expelOutput();
    };
</script>

<!-- TODO: Reafactor and/or split up. Too long and nested component -->
<div
        bind:clientWidth={componentWidth}
        class="h-full w-full bg-white border-t border-solid border-black border-opacity-60 shadow-black shadow-xl"
        class:bg-gray-300={$state.isInputAssigned && !$state.isInputReady}
>
    <MainConnectDialog
            bind:this={connectDialogReference}
    />
    {#if !$state.isInputAssigned}
        <!-- No input microbit assigned -->
        <div class="h-full w-full flex justify-center bg-white">
            <StandardButton onClick={connectButtonClicked}
                            text={$t("footer.connectButtonNotConnected")}/>
        </div>
    {:else}
        <!-- Input microbit is assigned -->
        <div class="relative w-full h-full">
            <div class="absolute w-full h-full">
                <LiveGraph width={componentWidth}/>
            </div>
            {#if !$state.isInputReady}
                <!-- Input is not ready, but is assigned (Must be either reconnecting or have lost connection entirely) -->
                <div class="absolute w-full h-full flex items-center justify-center text-white">
                    <div class="bg-[#EDBFD9] py-2 px-4 rounded-full" transition:fade>
                        <h1>{$t("footer.reconnecting")}</h1>
                    </div>
                </div>
            {/if}
            <div class="w-full h-full p-0 m-0 absolute top-0 left-0">
                <div class="float-left mt-2 ml-2">
                    <div class="float-left">
                        <TextInformation titleText={$t("footer.helpHeader")}
                                         bodyText={$t("footer.helpContent")}
                                         isLightTheme={false}
                                         boxOffset={{x: 25, y: -50}}/>
                    </div>
                    <p class="float-left ml-10">Live</p>
                    <p class="float-left ml-1 -mt-3 text-3xl"
                       class:text-red-500={$state.isInputReady}
                       class:text-gray-500={!$state.isInputReady}>&#x2022;</p>
                </div>
                <div class="absolute right-2 top-2 m-0 float-right flex">
                    {#if ($state.isPredicting || $state.isTraining) || $state.isOutputConnected}
                        {#if $state.isOutputAssigned}
                            <!-- Output is assigned -->
                            {#if !$state.isOutputConnected || $state.isOutputReady}
                                <!-- Output MB is not in the connection process -->
                                <StandardButton onClick={outputDisconnectButtonClicked}
                                                color="red"
                                                text={$t("menu.model.disconnect")}/>
                            {:else}
                                <StandardButton onClick={TypingUtils.emptyFunction}
                                                color="gray"
                                                text="">
                                    <img alt="loading" src="imgs/loadingspinner.gif" style="height:24px">
                                </StandardButton>
                            {/if}
                        {:else}
                            <StandardButton onClick={connectButtonClicked}
                                            text={$t("menu.model.connectOutputButton")}/>
                        {/if}
                    {/if}
                    <div class="ml-2">
                        {#if !$state.isInputConnected || $state.isInputReady}
                            <!-- Input MB is not in the connection process -->
                            <StandardButton onClick={inputDisconnectButtonClicked}
                                            color="red"
                                            text={$t("footer.disconnectButton")}/>
                        {:else}
                            <StandardButton onClick={TypingUtils.emptyFunction}
                                            color="gray"
                                            text="">
                                <img alt="loading" src="imgs/loadingspinner.gif" style="height:24px">
                            </StandardButton>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

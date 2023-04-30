<script lang="ts">
    import type { RadioButtonAction } from "../../../script/ControlBarItems";
    import RadioButton from "./RadioButton.svelte";
    export let items: RadioButtonAction[]
    
    const groupIdentifier: string = Math.random().toString() // For when using multiple radio groups.

    let selectedItem: number = -1;

    const select = (index: number) => {
        if (selectedItem != -1) {
            const selectedAction = items[selectedItem]
            if (selectedAction.onDeselect) {
                selectedAction.onDeselect();
            }
        }
        selectedItem = index
        items[selectedItem].onSelect();
    }
</script>

<div class="flex flex-row">
    {#each items as item, index}
        <div class="mr-2">
            <RadioButton identifier={groupIdentifier} label={item.label} onSelect={()=> {select(index)}}/>
        </div>
    {/each}
</div>

<script lang="ts">
    export let label: string;
    export let onSelect: () => void;
    export let identifier: string;
    const onChange = () => {
        onSelect();
    }
</script>

<div class="flex items-center">
    <input type="radio" id="radio_{identifier}_{label}" class="w-4 h-4" name={identifier} value="{label}" on:change={onChange}/>
    <label for="radio_{identifier}_{label}" class="ml-1">{label}</label>
</div>

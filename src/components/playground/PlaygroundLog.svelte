<script lang="ts">
    import playgroundContext from "./PlaygroundContext";
</script>

<div>
    {#each $playgroundContext.messages as message}
    <p class="whitespace-pre mb-1 hover:(font-bold) border-b-1 border-solid">> {message.toString()}</p>
    {/each}
</div>
<script lang="ts">
  import Gesture from './script/stores/Gesture';

  let i = 0;
  setInterval(() => {
    i++;
  }, 1000);
</script>
<!--
<div>
  {#each $gestures as $gest}
    <p>{$gest.name}</p>
  {/each}
</div>
-->
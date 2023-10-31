<script lang="ts">
  import Stores from './script/stores/Stores';
  import Gesture from './script/stores/Gesture';
  import Gestures from './script/stores/Gestures';

  const gestures: Gestures = Stores.gestures;
  const ss = gestures
  let i = 0;
  setInterval(() => {
    i++;
  }, 1000);
</script>
<!--
<div>
  {#each $ss as $gest}
    <p>{$gest.name}</p>
  {/each}
</div>
-->
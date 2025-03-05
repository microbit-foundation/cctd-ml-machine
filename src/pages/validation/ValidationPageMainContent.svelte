<script lang="ts">
  import { stores } from '../../script/stores/Stores';
  import ValidationPageGestureLane from './ValidationPageGestureLane.svelte';

  const gestures = stores.getGestures();
</script>

<div>
  {#each $gestures as gesture}
    <ValidationPageGestureLane gesture={gestures.getGesture(gesture.ID)} />
  {/each}
</div>

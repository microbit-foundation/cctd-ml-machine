<script lang="ts">
  import { stores } from '../../script/stores/Stores';
  import ValidationGestureNameCard from './ValidationGestureNameCard.svelte';

  const gestures = stores.getGestures();
</script>

<div class="p-4 gap-2 grid grid-cols-[max(200px,20%)_1fr]">
  {#each $gestures as gesture}
    <div class="col-start-1">
      <ValidationGestureNameCard gesture={gestures.getGesture(gesture.ID)} />
    </div>
  {/each}
</div>

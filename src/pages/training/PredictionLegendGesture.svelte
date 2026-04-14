<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import GestureDot from '../../components/ui/GestureDot.svelte';
  import type { GestureID } from '../../core/entities/NewGesture';

  const microbitController = getControllers().getMicrobitController();
  const microbitConnection = microbitController.getMicrobitConnectionState();
  export let gestureId: GestureID;
  const gesture = getControllers().getGestureController().getGestureState(gestureId);
</script>

<div class="flex flex-row justify-between">
  <div class="flex flex-row">
    <div class="flex flex-col justify-center mr-1">
      <GestureDot disableTooltip gesture={$gesture} />
    </div>
    <p>{$gesture.getName()}</p>
  </div>
  {#if $microbitConnection.getInput().isReady()}
    <p>
      {($gesture.getConfidence().currentConfidence * 100).toFixed(1)}%
    </p>
  {/if}
</div>

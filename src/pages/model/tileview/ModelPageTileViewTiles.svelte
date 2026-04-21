<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import MediaQuery from '../../../components/layout/MediaQuery.svelte';
  import OutputGesture from '../../../components/features/model/ModelGesture.svelte';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';

  const gestureController = getControllers().getGestureController();
  const gestures = gestureController.getGestures();

  onMount(() => {
    Microbits.resetIOPins();
  });

</script>

<MediaQuery query="(max-width: 1000px)" let:matches>
  {#if matches}
    <div class="grid grid-cols-3 gap-4">
      {#each $gestures.map(e => gestureController.getGestureState(e.getID())) as gesture}
        <OutputGesture {gesture} variant={'tile'} />
      {/each}
    </div>
  {/if}
</MediaQuery>
<MediaQuery query="(min-width: 1000px) and (max-width: 1367px)" let:matches>
  {#if matches}
    <div class="grid grid-cols-4 gap-4">
      {#each $gestures.map(e => gestureController.getGestureState(e.getID())) as gesture}
        <OutputGesture {gesture} variant={'tile'} />
      {/each}
    </div>
  {/if}
</MediaQuery>
<MediaQuery query="(min-width: 1367px)" let:matches>
  {#if matches}
    <div class="grid grid-cols-5 gap-4">
      {#each $gestures.map(e => gestureController.getGestureState(e.getID())) as gesture}
        <OutputGesture {gesture} variant={'tile'} />
      {/each}
    </div>
  {/if}
</MediaQuery>

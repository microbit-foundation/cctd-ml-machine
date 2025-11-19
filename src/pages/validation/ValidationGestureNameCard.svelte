<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
    import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import GestureCard from '../../components/ui/Card.svelte';
  import GestureDot from '../../components/ui/GestureDot.svelte';
    import type { GestureID } from '../../core/entities/Gesture';

  export let gestureId: GestureID;
  const gestureController = getControllers().getGestureController();
  const gesture = gestureController.getGestureState(gestureId);
</script>

<GestureCard validationPage small>
  <div class="self-center px-4 flex flex-col h-full relative justify-center">
    <div>
      <div
        class="flex-grow text-center font-semibold rounded-xl border bg-white bg-opacity-85 border-primaryborderaccent border-solid px-4">
        <p>{$gesture.getName()}</p>
      </div>
    </div>
    <!-- DOT -->
    <div class="absolute top-3 left-3">
      <GestureDot gestureId={$gesture.getID()} />
    </div>
  </div>
</GestureCard>
